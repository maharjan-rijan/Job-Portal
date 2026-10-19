<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendRegistrationRequest;
use App\Http\Requests\Auth\VerifyRegistrationRequest;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Sign-up with email verification:
 *
 *   POST /auth/register          validate the form, keep it PENDING (cache) and email a 6-digit code
 *   POST /auth/register/verify   right code -> the account is created now (email_verified_at set)
 *   POST /auth/register/resend   new code (60 s cooldown)
 *
 * No user row exists until the code is verified, so a mistyped / fake email
 * never leaves an account behind and never blocks the real owner from signing up.
 */
class RegistrationController extends Controller
{
    private const OTP_TTL_MINUTES = 10;
    private const OTP_MAX_ATTEMPTS = 5;
    private const RESEND_COOLDOWN_SECONDS = 60;

    public function start(RegisterRequest $request)
    {
        $email = $this->normalize($request->email);

        $pending = [
            'name' => $request->name,
            'email' => $email,
            'password' => Hash::make($request->password), // never keep the plain password
            'role' => $request->role,
            'company_name' => $request->company_name,
        ];

        if (! $this->issueCode($pending)) {
            return response()->json(['message' => 'We could not send the email right now. Please try again shortly.'], 500);
        }

        return response()->json(['message' => 'Verification code sent', 'email' => $email]);
    }

    public function resend(ResendRegistrationRequest $request)
    {
        $email = $this->normalize($request->email);
        $data = Cache::get($this->key($email));

        if (! $data) {
            return response()->json(['message' => 'Your sign-up session has expired. Please register again.'], 422);
        }

        $until = Cache::get($this->cooldownKey($email));
        if ($until && $until > time()) {
            return response()->json(['message' => 'Please wait ' . ($until - time()) . ' seconds before requesting another.'], 429);
        }

        if (! $this->issueCode($data['pending'])) {
            return response()->json(['message' => 'We could not send the email right now. Please try again shortly.'], 500);
        }

        return response()->json(['message' => 'A new code has been sent']);
    }

    public function verify(VerifyRegistrationRequest $request)
    {
        $email = $this->normalize($request->email);
        $key = $this->key($email);
        $data = Cache::get($key);

        if (! $data || $data['expires_at'] < time()) {
            Cache::forget($key);

            return response()->json(['message' => 'That code is incorrect or has expired'], 422);
        }

        if (! Hash::check((string) $request->otp, $data['hash'])) {
            $data['attempts']++;

            if ($data['attempts'] >= self::OTP_MAX_ATTEMPTS) {
                Cache::forget($key);

                return response()->json(['message' => 'Too many incorrect attempts. Please request a new code.'], 422);
            }

            Cache::put($key, $data, max(1, $data['expires_at'] - time()));

            return response()->json(['message' => 'That code is incorrect or has expired'], 422);
        }

        // Someone could have registered this email while the code was pending.
        if (User::where('email', $email)->exists()) {
            Cache::forget($key);

            return response()->json(['message' => 'This email is already registered. Please log in.'], 422);
        }

        $p = $data['pending'];

        DB::transaction(function () use ($p) {
            $user = User::create([
                'name' => $p['name'],
                'email' => $p['email'],
                'password' => $p['password'], // already hashed
                'role' => $p['role'],
            ]);

            $user->forceFill(['email_verified_at' => now()])->save();

            if ($p['role'] === 'employer') {
                $user->company()->create(['name' => $p['company_name']]);
            }
        });

        Cache::forget($key);
        Cache::forget($this->cooldownKey($email));

        return response()->json(['message' => 'Account registered successfully'], 201);
    }

    // ---------------------------------------------------------------------

    /** Generates a code, stores it with the pending data and emails it. */
    private function issueCode(array $pending): bool
    {
        $email = $pending['email'];
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        try {
            Cache::put($this->key($email), [
                'pending' => $pending,
                'hash' => Hash::make($otp),
                'attempts' => 0,
                'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES)->timestamp,
            ], now()->addMinutes(self::OTP_TTL_MINUTES));

            $this->sendOtpEmail($pending['name'], $email, $otp);

            Cache::put($this->cooldownKey($email), time() + self::RESEND_COOLDOWN_SECONDS, self::RESEND_COOLDOWN_SECONDS);

            return true;
        } catch (Throwable $e) {
            Cache::forget($this->key($email));
            Log::error('Registration email failed: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());

            return false;
        }
    }

    private function sendOtpEmail(string $name, string $email, string $otp): void
    {
        $app = e(config('app.name'));
        $minutes = self::OTP_TTL_MINUTES;

        $html = '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif;color:#18181b;">'
            . '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">'
            . '<h2 style="margin:0 0 8px;font-size:20px;">Verify your email</h2>'
            . '<p style="margin:0 0 20px;font-size:14px;color:#52525b;">Hi ' . e($name) . ', welcome to ' . $app . '! Use this code to finish creating your account:</p>'
            . '<p style="margin:0 0 20px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;color:#059669;">' . e($otp) . '</p>'
            . "<p style=\"margin:0 0 8px;font-size:13px;color:#52525b;\">This code expires in {$minutes} minutes. Never share it with anyone.</p>"
            . '<p style="margin:0;font-size:13px;color:#a1a1aa;">Did not sign up? You can safely ignore this email.</p>'
            . '</div></body></html>';

        Mail::html($html, function ($message) use ($email, $app) {
            $message->to($email)->subject('Your ' . config('app.name') . ' verification code');
        });
    }

    private function normalize(string $email): string
    {
        return strtolower(trim($email));
    }

    private function key(string $email): string
    {
        return 'register-otp:' . sha1($email);
    }

    private function cooldownKey(string $email): string
    {
        return 'register-otp-cooldown:' . sha1($email);
    }
}
