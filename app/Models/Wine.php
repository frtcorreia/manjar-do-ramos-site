<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wine extends Model
{
    public const REGIONS = [
        'Douro',
        'Alentejo',
        'Dão',
        'Vinho Verde',
        'Bairrada',
        'Lisboa',
        'Tejo',
        'Setúbal',
        'Açores',
        'Madeira',
        'Távora-Varosa',
        'Beira Interior',
        'Algarve',
    ];

    protected $fillable = [
        'wine_category_id',
        'name',
        'producer',
        'region',
        'year',
        'price',
        'image',
        'notes',
        'visible',
        'position',
    ];

    protected $casts = ['visible' => 'boolean'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(WineCategory::class, 'wine_category_id');
    }
}
