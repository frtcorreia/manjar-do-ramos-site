<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Support\Facades\Session;

/**
 * Carrinho de encomendas guardado na sessão: [menu_item_id => quantidade].
 */
class Cart
{
    protected const KEY = 'cart';

    /** @return array<int, int> */
    public static function all(): array
    {
        return Session::get(self::KEY, []);
    }

    public static function quantity(int $itemId): int
    {
        return self::all()[$itemId] ?? 0;
    }

    public static function add(int $itemId): void
    {
        $cart = self::all();
        $cart[$itemId] = ($cart[$itemId] ?? 0) + 1;
        Session::put(self::KEY, $cart);
    }

    public static function remove(int $itemId): void
    {
        $cart = self::all();
        if (($cart[$itemId] ?? 0) <= 1) {
            unset($cart[$itemId]);
        } else {
            $cart[$itemId]--;
        }
        Session::put(self::KEY, $cart);
    }

    public static function clear(): void
    {
        Session::forget(self::KEY);
    }

    public static function count(): int
    {
        return array_sum(self::all());
    }

    /**
     * Linhas do carrinho com o item carregado; ignora itens entretanto
     * removidos ou tornados indisponíveis para entrega.
     *
     * @return array<int, array{item: MenuItem, quantity: int, subtotal: float}>
     */
    public static function lines(): array
    {
        $cart = self::all();

        if ($cart === []) {
            return [];
        }

        $items = MenuItem::whereIn('id', array_keys($cart))
            ->where('visible', true)
            ->where('delivery', true)
            ->get()
            ->keyBy('id');

        $lines = [];
        foreach ($cart as $id => $quantity) {
            $item = $items->get($id);
            if (! $item) {
                continue;
            }
            $lines[] = [
                'item' => $item,
                'quantity' => $quantity,
                'subtotal' => $item->priceDecimal() * $quantity,
            ];
        }

        return $lines;
    }

    public static function total(): float
    {
        return array_sum(array_column(self::lines(), 'subtotal'));
    }
}
