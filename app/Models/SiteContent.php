<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Conteúdo editável de um bloco da homepage ("block_hero", …) ou de uma
 * página ("page_ementa", …). O value tem a forma:
 * { key, label, fields: [{id,label,value,multiline?}], images: [{id,label,url,title?,description?}], backgroundColor? }
 */
class SiteContent extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    public static function block(string $key): ContentBag
    {
        return static::bag("block_$key");
    }

    public static function page(string $key): ContentBag
    {
        return static::bag("page_$key");
    }

    protected static function bag(string $key): ContentBag
    {
        $value = Cache::remember(
            "site_contents.$key",
            60,
            fn () => static::find($key)?->value,
        );

        return new ContentBag($value ?? []);
    }

    public static function forget(string $key): void
    {
        Cache::forget("site_contents.$key");
    }
}
