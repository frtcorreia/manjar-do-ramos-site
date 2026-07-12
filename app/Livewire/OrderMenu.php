<?php

namespace App\Livewire;

use App\Models\MenuCategory;
use App\Services\Cart;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('Encomendas · Manjar do Ramos · Delivery')]
class OrderMenu extends Component
{
    public function add(int $itemId): void
    {
        Cart::add($itemId);
    }

    public function remove(int $itemId): void
    {
        Cart::remove($itemId);
    }

    public function render()
    {
        $categories = MenuCategory::with(['items' => fn ($q) => $q->where('visible', true)->where('delivery', true)])
            ->orderBy('position')
            ->get()
            ->filter(fn (MenuCategory $cat) => $cat->items->isNotEmpty());

        return view('livewire.order-menu', [
            'categories' => $categories,
            'cart' => Cart::all(),
            'lines' => Cart::lines(),
            'total' => Cart::total(),
        ]);
    }
}
