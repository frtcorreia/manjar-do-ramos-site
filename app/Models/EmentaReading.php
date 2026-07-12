<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmentaReading extends Model
{
    public $timestamps = false;

    protected $fillable = ['created_at'];

    protected $casts = ['created_at' => 'datetime'];
}
