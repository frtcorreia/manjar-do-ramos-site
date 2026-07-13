<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class MenuCategory extends Model
{
    protected $fillable = ['name', 'position'];

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('position');
    }

    public function slug(): string
    {
        return Str::slug($this->name) ?: "categoria-{$this->id}";
    }
}
