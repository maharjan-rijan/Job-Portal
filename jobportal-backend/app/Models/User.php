<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }
    public function company(): HasOne
    {
        return $this->hasOne(Company::class, 'user_id');
    }

    public function jobPosts(): HasOne
    {
        return $this->hasOne(JobPost::class, 'employer_id');
    }

    public function resume(): HasOne
    {
        return $this->hasOne(Resume::class, 'user_id');
    }
}
