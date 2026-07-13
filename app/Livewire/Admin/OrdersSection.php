<?php

namespace App\Livewire\Admin;

use App\Models\Order;

class OrdersSection extends AdminSection
{
    public function updateStatus(int $orderId, string $status): void
    {
        if (! array_key_exists($status, Order::STATUSES)) {
            return;
        }

        Order::whereKey($orderId)->update(['status' => $status]);
        $this->saved('Estado atualizado.');
    }

    public function deleteOrder(int $orderId): void
    {
        Order::whereKey($orderId)->delete();
        $this->saved('Encomenda removida.');
    }

    public function render()
    {
        return view('livewire.admin.orders-section', [
            'orders' => Order::with('items')->latest()->get(),
            'statuses' => Order::STATUSES,
        ]);
    }
}
