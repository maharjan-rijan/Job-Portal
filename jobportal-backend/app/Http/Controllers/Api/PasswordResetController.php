<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Throwable;

/**
 * Forgot-password flow used by the React app:
 *
 *   POST /auth/forgot-password  email a reset LINK or a 6-digit CODE
 *   POST /auth/verify-otp       swap a valid code for a one-time reset token
 *   POST /auth/reset-password   set the new password (token from the link or from verify-otp)
 *
 * Both methods end in the same place: a Laravel password-broker token
 * (stored hashed in `password_reset_tokens`, valid for config('auth.passwords.users.expire')
 * minutes, single use). The OTP itself only lives in the cache.
 */
class PasswordResetController extends Controller
{
    private const OTP_TTL_MINUTES = 10;
    private const OTP_MAX_ATTEMPTS = 5;
    private const RESEND_COOLDOWN_SECONDS = 60;

    /**
     * true  -> tell the user when an email isn't registered (friendlier, but lets
     *          anyone test which emails have accounts).
     * false -> always answer "if that email exists, we sent it".
     */
    private const REVEAL_UNREGISTERED = true;

    public function forgot(ForgotPasswordRequest $request)
    {
        $email = Str::lower(trim($request->email));
        $method = $request->input('method') === 'otp' ? 'otp' : 'link';

        $user = User::where('email', $email)->first();

        if (! $user) {
            if (self::REVEAL_UNREGISTERED) {
                return response()->json(['message' => 'No account found with this email address'], 404);
            }

            return response()->json(['message' => 'If that email is registered, we have sent it.']);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'This account has been blocked. Contact support for help.'], 403);
        }

        // Server-side resend cooldown (the React timer is only cosmetic).
        $cooldownKey = $this->cooldownKey($email);
        $until = Cache::get($cooldownKey);
        if ($until && $until > time()) {
            $wait = $until - time();

            return response()->json(['message' => "Please wait {$wait} seconds before requesting another."], 429);
        }

        try {
            if ($method === 'otp') {
                $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

                Cache::put($this->otpKey($email), [
                    'hash' => Hash::make($otp),
                    'attempts' => 0,
                    'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES)->timestamp,
                ], now()->addMinutes(self::OTP_TTL_MINUTES));

                $this->sendOtpEmail($user, $otp);
            } else {
                $token = Password::broker()->createToken($user);
                $url = $this->frontendUrl() . '/reset-password?' . http_build_query([
                    'token' => $token,
                    'email' => $user->email,
                ]);

                $this->sendLinkEmail($user, $url);
            }
        } catch (Throwable $e) {
            Log::error('Password reset email failed: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());

            return response()->json([
                'message' => config('app.debug')
                    ? 'Email failed: ' . $e->getMessage() . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')'
                    : 'We could not send the email right now. Please try again shortly.',
            ], 500);
        }

        Cache::put($cooldownKey, time() + self::RESEND_COOLDOWN_SECONDS, self::RESEND_COOLDOWN_SECONDS);

        return response()->json([
            'message' => $method === 'otp' ? 'Verification code sent' : 'Reset link sent',
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $email = Str::lower(trim($request->email));
        $key = $this->otpKey($email);
        $invalid = response()->json(['message' => 'That code is incorrect or has expired'], 422);

        $data = Cache::get($key);
        if (! $data) {
            return $invalid;
        }

        if (! Hash::check((string) $request->otp, $data['hash'])) {
            $data['attempts']++;

            if ($data['attempts'] >= self::OTP_MAX_ATTEMPTS) {
                Cache::forget($key);

                return response()->json(['message' => 'Too many incorrect attempts. Please request a new code.'], 422);
            }

            // Keep the original expiry — wrong guesses must not extend the code's life.
            $remaining = max(1, $data['expires_at'] - time());
            Cache::put($key, $data, $remaining);

            return $invalid;
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return $invalid;
        }

        Cache::forget($key); // a code works once

        return response()->json([
            'token' => Password::broker()->createToken($user),
        ]);
    }

    public function reset(ResetPasswordRequest $request)
    {
        $email = Str::lower(trim($request->email));

        $status = Password::reset(
            [
                'email' => $email,
                'token' => $request->token,
                'password' => $request->password,
                'password_confirmation' => $request->password_confirmation,
            ],
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Sign the account out everywhere: old sessions shouldn't survive a reset.
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'This reset link or code is invalid or has expired. Please request a new one.',
            ], 422);
        }

        Cache::forget($this->otpKey($email));
        Cache::forget($this->cooldownKey($email));

        return response()->json(['message' => 'Password reset successful']);
    }

    private function otpKey(string $email): string
    {
        return 'pwd-reset:otp:' . sha1($email);
    }

    private function cooldownKey(string $email): string
    {
        return 'pwd-reset:cooldown:' . sha1($email);
    }

    private function frontendUrl(): string
    {
        return rtrim((string) (config('app.frontend_url') ?: 'http://localhost:5173'), '/');
    }

    // ---- Emails (built inline so no separate Mailable / Blade files are needed) ----

    private function sendOtpEmail(User $user, string $otp): void
    {
        $minutes = self::OTP_TTL_MINUTES;
        $body = '<h2 style="margin:0 0 8px;font-size:20px;">Verification code</h2>'
            . '<p style="margin:0 0 20px;font-size:14px;color:#52525b;">Hi ' . e($user->name) . ', use this code to reset your ' . e(config('app.name')) . ' password:</p>'
            . '<p style="margin:0 0 20px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;color:#059669;">' . e($otp) . '</p>'
            . "<p style=\"margin:0 0 8px;font-size:13px;color:#52525b;\">This code expires in {$minutes} minutes. Never share it with anyone.</p>"
            . $this->ignoreNote();

        $this->sendHtml($user, 'Your ' . config('app.name') . ' verification code', $body);
    }

    private function sendLinkEmail(User $user, string $url): void
    {
        $minutes = (int) config('auth.passwords.users.expire', 60);
        $safe = e($url);
        $body = '<h2 style="margin:0 0 8px;font-size:20px;">Reset your password</h2>'
            . '<p style="margin:0 0 20px;font-size:14px;color:#52525b;">Hi ' . e($user->name) . ', we received a request to reset your ' . e(config('app.name')) . ' password.</p>'
            . '<p style="margin:0 0 24px;text-align:center;"><a href="' . $safe . '" style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:8px;">Reset password</a></p>'
            . "<p style=\"margin:0 0 8px;font-size:13px;color:#52525b;\">This link expires in {$minutes} minutes and can be used once.</p>"
            . '<p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;word-break:break-all;">If the button does not work, paste this into your browser:<br>' . $safe . '</p>'
            . $this->ignoreNote();

        $this->sendHtml($user, 'Reset your ' . config('app.name') . ' password', $body);
    }

    private function ignoreNote(): string
    {
        return '<p style="margin:0;font-size:13px;color:#a1a1aa;">Did not ask for this? You can safely ignore this email - your password will not change.</p>';
    }

    private function sendHtml(User $user, string $subject, string $body): void
    {
        $html = '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif;color:#18181b;">'
            . '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">' . $body . '</div></body></html>';

        Mail::html($html, function ($message) use ($user, $subject) {
            $message->to($user->email)->subject($subject);
        });
    }
}
