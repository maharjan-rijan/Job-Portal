<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'skills',
        'location',
        'website',
        'expected_salary',
        'education',
        'experience',
        'social_links',
        'achievements',
        'template',
        'color',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'education' => 'array',
            'experience' => 'array',
            'social_links' => 'array',
            'achievements' => 'array',
        ];
    }

    protected $attributes = [
        'skills' => '[]',
        'education' => '[]',
        'experience' => '[]',
        'social_links' => '[]',
        'achievements' => '[]',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::retrieved(function (Resume $resume) {
            $resume->loadMissing('user');
        });
    }

    public function toArray(): array
    {
        $data = parent::toArray();
        $data['name'] = $this->user?->name;
        $data['email'] = $this->user?->email;
        unset($data['user']);
        return $data;
    }
}
