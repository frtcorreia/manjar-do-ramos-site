<?php

namespace App\Livewire;

use App\Models\Order;
use App\Services\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('Checkout · Manjar do Ramos')]
class Checkout extends Component
{
    public string $customer_name = '';
    public string $phone = '';
    public string $address = '';
    public string $nif = '';
    public string $notes = '';

    public function mount(): void
    {
        if ($user = Auth::user()) {
            $this->customer_name = $user->name ?? '';
            $this->phone = $user->phone ?? '';
            $this->address = $user->address ?? '';
            $this->nif = $user->nif ?? '';
        }
    }

    public function submit(): void
    {
        if (! Auth::check()) {
            $this->redirectRoute('auth', ['redirect' => 'checkout']);

            return;
        }

        $data = $this->validate([
            'customer_name' => ['required', 'string', 'min:1', 'max:120'],
            'phone' => ['required', 'string', 'min:6', 'max:30'],
            'address' => ['required', 'string', 'min:5', 'max:300'],
            'nif' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [], [
            'customer_name' => 'nome',
            'phone' => 'telefone',
            'address' => 'morada',
        ]);

        $lines = Cart::lines();

        if ($lines === []) {
            $this->addError('customer_name', 'Carrinho vazio.');

            return;
        }

        DB::transaction(function () use ($data, $lines) {
            $order = Order::create([
                'user_id' => Auth::id(),
                'total' => array_sum(array_column($lines, 'subtotal')),
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'nif' => $data['nif'] ?? '',
                'notes' => $data['notes'] ?? '',
            ]);

            foreach ($lines as $line) {
                $order->items()->create([
                    'name' => $line['item']->name,
                    'price' => $line['item']->priceDecimal(),
                    'quantity' => $line['quantity'],
                ]);
            }

            // Guarda as preferências no perfil para o próximo checkout
            Auth::user()->update([
                'name' => $data['customer_name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'nif' => $data['nif'] ?? '',
            ]);
        });

        Cart::clear();
        session()->flash('status', 'Encomenda enviada!');

        $this->redirectRoute('orders.mine');
    }

    public function render()
    {
        return view('livewire.checkout', [
            'lines' => Cart::lines(),
            'total' => Cart::total(),
        ]);
    }
}
