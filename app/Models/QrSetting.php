<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QrSetting extends Model
{
    public const LOCATIONS = [
        'restaurante' => 'Restaurante',
        'esplanada' => 'Esplanada',
    ];

    protected $primaryKey = 'location';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['location', 'secret_key', 'duration_minutes'];

    public static function generateKey(): string
    {
        return Str::lower(Str::random(32));
    }

    public function regenerate(): string
    {
        $this->update(['secret_key' => static::generateKey()]);

        return $this->secret_key;
    }
}
