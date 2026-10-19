<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PasswordResetOtpMail extends Mailable
{
    public function __construct(
        public User $user,
        public string $otp,
        public int $minutes,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your ' . config('app.name') . ' verification code');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.password-reset-otp');
    }
}
