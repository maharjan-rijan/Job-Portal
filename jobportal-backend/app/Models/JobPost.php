<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobPost extends Model
{
    protected $table = 'job_posts'; // explicit — Eloquent would guess "job_posts" anyway from "JobPost", but stating it removes any ambiguity

    protected $fillable = [
        'employer_id', 'title', 'type', 'location', 'salary_min', 'salary_max',
        'vacancies', 'experience_level', 'application_deadline', 'description',
        'responsibilities', 'requirements', 'benefits', 'status',
    ];

    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'requirements' => 'array',
            'benefits' => 'array',
            'application_deadline' => 'date',
        ];
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    
}
