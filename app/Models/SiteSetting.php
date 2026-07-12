<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = Cache::remember(
            "site_settings.$key",
            60,
            fn () => static::find($key)?->value,
        );

        if ($value === null) {
            return $default;
        }

        // Preenche chaves novas que ainda não foram gravadas
        if (is_array($default) && is_array($value)) {
            return array_replace($default, $value);
        }

        return $value;
    }

    public static function put(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("site_settings.$key");
    }
}
