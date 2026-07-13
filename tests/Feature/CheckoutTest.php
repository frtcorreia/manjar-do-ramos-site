<?php

namespace Tests\Feature;

use App\Livewire\Checkout;
use App\Livewire\OrderMenu;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\MenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(MenuSeeder::class);
    }

    public function test_cart_add_and_remove(): void
    {
        $item = MenuItem::where('name', 'Bitoque de Vitela')->first();

        Livewire::test(OrderMenu::class)
            ->call('add', $item->id)
            ->call('add', $item->id)
            ->assertSee('Bitoque de Vitela');

        $this->assertSame([$item->id => 2], session('cart'));

        Livewire::test(OrderMenu::class)->call('remove', $item->id);
        $this->assertSame([$item->id => 1], session('cart'));
    }

    public function test_checkout_creates_order_and_updates_profile(): void
    {
        $user = User::create([
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'password123',
        ]);

        $item = MenuItem::where('name', 'Bitoque de Vitela')->first(); // 14,50€
        session(['cart' => [$item->id => 2]]);

        Livewire::actingAs($user)
            ->test(Checkout::class)
            ->set('customer_name', 'João Santos')
            ->set('phone', '912345678')
            ->set('address', 'Rua das Flores 1, Lisboa')
            ->set('nif', '123456789')
            ->set('notes', 'Sem coentros')
            ->call('submit')
            ->assertHasNoErrors()
            ->assertRedirect(route('orders.mine'));

        $order = Order::with('items')->first();
        $this->assertNotNull($order);
        $this->assertSame($user->id, $order->user_id);
        $this->assertSame('pendente', $order->status);
        $this->assertEquals(29.00, (float) $order->total);
        $this->assertCount(1, $order->items);
        $this->assertSame(2, $order->items->first()->quantity);

        // Carrinho limpo e perfil atualizado
        $this->assertEmpty(session('cart', []));
        $this->assertSame('912345678', $user->fresh()->phone);
    }

    public function test_checkout_with_empty_cart_fails(): void
    {
        $user = User::create([
            'name' => 'João',
            'email' => 'joao@example.com',
            'password' => 'password123',
        ]);

        Livewire::actingAs($user)
            ->test(Checkout::class)
            ->set('customer_name', 'João')
            ->set('phone', '912345678')
            ->set('address', 'Rua das Flores 1')
            ->call('submit')
            ->assertHasErrors('customer_name');

        $this->assertSame(0, Order::count());
    }

    public function test_guest_cannot_submit_order(): void
    {
        $item = MenuItem::first();
        session(['cart' => [$item->id => 1]]);

        Livewire::test(Checkout::class)
            ->set('customer_name', 'Anon')
            ->set('phone', '912345678')
            ->set('address', 'Rua X 1')
            ->call('submit');

        $this->assertSame(0, Order::count());
    }
}
