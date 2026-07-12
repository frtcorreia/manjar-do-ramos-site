<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['quote', 'name', 'context', 'visible', 'position'];

    protected $casts = ['visible' => 'boolean'];
}
