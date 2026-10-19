<?php

namespace Tests\Feature;

use App\Mail\PasswordResetLinkMail;
use App\Mail\PasswordResetOtpMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(): User
    {
        return User::create([
            'name' => 'Sunita Gurung',
            'email' => 'sunita@example.com',
            'password' => Hash::make('old-password'),
            'role' => 'seeker',
        ]);
    }

    public function test_link_flow_resets_the_password(): void
    {
        Mail::fake();
        $user = $this->makeUser();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email, 'method' => 'link'])
            ->assertOk();

        $url = Mail::sent(PasswordResetLinkMail::class)->first()->url;
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        $this->postJson('/api/auth/reset-password', [
            'email' => $query['email'],
            'token' => $query['token'],
            'password' => 'new-password-1',
            'password_confirmation' => 'new-password-1',
        ])->assertOk();

        $this->assertTrue(Hash::check('new-password-1', $user->fresh()->password));

        // the token is single-use
        $this->postJson('/api/auth/reset-password', [
            'email' => $query['email'],
            'token' => $query['token'],
            'password' => 'another-pass-2',
            'password_confirmation' => 'another-pass-2',
        ])->assertStatus(422);
    }

    public function test_otp_flow_resets_the_password(): void
    {
        Mail::fake();
        $user = $this->makeUser();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email, 'method' => 'otp'])
            ->assertOk();

        $otp = Mail::sent(PasswordResetOtpMail::class)->first()->otp;

        $token = $this->postJson('/api/auth/verify-otp', ['email' => $user->email, 'otp' => $otp])
            ->assertOk()
            ->json('token');

        $this->postJson('/api/auth/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'new-password-1',
            'password_confirmation' => 'new-password-1',
        ])->assertOk();

        $this->assertTrue(Hash::check('new-password-1', $user->fresh()->password));
    }

    public function test_wrong_otp_is_rejected_and_locks_after_five_tries(): void
    {
        Mail::fake();
        $user = $this->makeUser();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email, 'method' => 'otp'])->assertOk();
        $otp = Mail::sent(PasswordResetOtpMail::class)->first()->otp;
        $wrong = $otp === '000000' ? '111111' : '000000';

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/verify-otp', ['email' => $user->email, 'otp' => $wrong])->assertStatus(422);
        }

        // even the right code no longer works — a new one must be requested
        $this->postJson('/api/auth/verify-otp', ['email' => $user->email, 'otp' => $otp])->assertStatus(422);
    }

    public function test_unregistered_email_gets_404(): void
    {
        Mail::fake();

        $this->postJson('/api/auth/forgot-password', ['email' => 'nobody@example.com', 'method' => 'link'])
            ->assertStatus(404);

        Mail::assertNothingSent();
    }

    public function test_requesting_again_too_soon_is_rate_limited(): void
    {
        Mail::fake();
        $user = $this->makeUser();

        $this->postJson('/api/auth/forgot-password', ['email' => $user->email, 'method' => 'otp'])->assertOk();
        $this->postJson('/api/auth/forgot-password', ['email' => $user->email, 'method' => 'otp'])->assertStatus(429);
    }
}
