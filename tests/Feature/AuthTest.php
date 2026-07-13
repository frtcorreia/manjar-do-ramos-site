<?php

namespace Tests\Feature;

use App\Livewire\AuthPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_customer(): void
    {
        Livewire::test(AuthPage::class)
            ->set('name', 'Maria Silva')
            ->set('email', 'maria@example.com')
            ->set('password', 'password123')
            ->call('register')
            ->assertHasNoErrors();

        $this->assertAuthenticated();
        $this->assertSame(User::ROLE_CUSTOMER, User::whereEmail('maria@example.com')->first()->role);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::create([
            'name' => 'Maria',
            'email' => 'maria@example.com',
            'password' => 'password123',
        ]);

        Livewire::test(AuthPage::class)
            ->set('loginEmail', 'maria@example.com')
            ->set('loginPassword', 'password123')
            ->call('login')
            ->assertHasNoErrors();

        $this->assertAuthenticated();
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::create([
            'name' => 'Maria',
            'email' => 'maria@example.com',
            'password' => 'password123',
        ]);

        Livewire::test(AuthPage::class)
            ->set('loginEmail', 'maria@example.com')
            ->set('loginPassword', 'errada')
            ->call('login')
            ->assertHasErrors('loginEmail');

        $this->assertGuest();
    }

    public function test_my_orders_requires_authentication(): void
    {
        $this->get('/minhas-encomendas')->assertRedirect();
    }
}
