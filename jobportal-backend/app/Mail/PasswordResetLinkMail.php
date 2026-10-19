<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PasswordResetLinkMail extends Mailable
{
    public function __construct(
        public User $user,
        public string $url,
        public int $minutes,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset your '.config('app.name').' password');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.password-reset-link');
    }
}
