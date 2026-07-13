<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleReview extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'author_name',
        'rating',
        'text',
        'relative_time_description',
        'profile_photo_url',
        'publish_time',
        'visible',
        'fetched_at',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'publish_time' => 'datetime',
        'fetched_at' => 'datetime',
    ];
}
