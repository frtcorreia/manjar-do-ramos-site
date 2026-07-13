<?php

namespace Tests\Feature;

use App\Livewire\Admin\OrdersSection;
use App\Livewire\Admin\RestauranteSection;
use App\Models\Order;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function admin(): User
    {
        return User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'role' => User::ROLE_ADMIN,
        ]);
    }

    protected function customer(): User
    {
        return User::create([
            'name' => 'Cliente',
            'email' => 'cliente@example.com',
            'password' => 'password123',
        ]);
    }

    public function test_guest_sees_admin_login(): void
    {
        $this->get('/admin')->assertOk()->assertSee('Backoffice');
    }

    public function test_customer_cannot_use_admin_sections(): void
    {
        Livewire::actingAs($this->customer())
            ->test(RestauranteSection::class)
            ->assertStatus(403);
    }

    public function test_guest_cannot_use_admin_sections(): void
    {
        Livewire::test(RestauranteSection::class)->assertStatus(403);
    }

    public function test_admin_can_save_restaurant_settings(): void
    {
        Livewire::actingAs($this->admin())
            ->test(RestauranteSection::class)
            ->set('r.telefone', '+351 999 888 777')
            ->call('save');

        $this->assertSame('+351 999 888 777', SiteSetting::get('restaurante')['telefone']);
    }

    public function test_admin_can_update_order_status(): void
    {
        $customer = $this->customer();
        $order = Order::create([
            'user_id' => $customer->id,
            'total' => 10,
            'customer_name' => 'Cliente',
        ]);

        Livewire::actingAs($this->admin())
            ->test(OrdersSection::class)
            ->call('updateStatus', $order->id, 'em_preparacao');

        $this->assertSame('em_preparacao', $order->fresh()->status);
    }

    public function test_invalid_status_is_rejected(): void
    {
        $order = Order::create([
            'user_id' => $this->customer()->id,
            'total' => 10,
            'customer_name' => 'Cliente',
        ]);

        Livewire::actingAs($this->admin())
            ->test(OrdersSection::class)
            ->call('updateStatus', $order->id, 'hackz');

        $this->assertSame('pendente', $order->fresh()->status);
    }
}
