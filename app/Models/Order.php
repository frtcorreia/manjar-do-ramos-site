<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUSES = [
        'pendente' => 'Pendente',
        'em_preparacao' => 'Em preparação',
        'pronto' => 'Pronto',
        'entregue' => 'Entregue',
    ];

    protected $fillable = [
        'user_id',
        'status',
        'total',
        'customer_name',
        'phone',
        'address',
        'nif',
        'notes',
    ];

    protected $casts = ['total' => 'decimal:2'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLabel(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function reference(): string
    {
        return '#'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }
}
