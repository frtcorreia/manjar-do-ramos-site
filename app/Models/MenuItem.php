<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    public const ALLERGENS = [
        'sulphites' => 'Sulfitos',
        'gluten' => 'Glúten',
        'milk' => 'Lactose',
        'eggs' => 'Ovo',
        'soy' => 'Soja',
        'celery' => 'Aipo',
        'fish' => 'Peixe',
        'molluscs' => 'Moluscos',
        'crustaceans' => 'Crustáceos',
        'nuts' => 'Frutos casca rija',
        'peanuts' => 'Amendoins',
        'lupin' => 'Tremoços',
        'mustard' => 'Mostarda',
        'sesame' => 'Sésamo',
    ];

    protected $fillable = [
        'menu_category_id',
        'name',
        'description',
        'price',
        'image',
        'delivery',
        'takeaway',
        'restaurant',
        'visible',
        'allergens',
        'position',
    ];

    protected $casts = [
        'delivery' => 'boolean',
        'takeaway' => 'boolean',
        'restaurant' => 'boolean',
        'visible' => 'boolean',
        'allergens' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'menu_category_id');
    }

    /** Converte o preço em texto ("18,00€ p/p") para decimal usável no carrinho. */
    public function priceDecimal(): float
    {
        return price_to_decimal($this->price);
    }
}
