<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class WineCategory extends Model
{
    protected $fillable = ['name', 'position'];

    public function wines(): HasMany
    {
        return $this->hasMany(Wine::class)->orderBy('position');
    }

    public function slug(): string
    {
        return Str::slug($this->name) ?: "categoria-{$this->id}";
    }
}
