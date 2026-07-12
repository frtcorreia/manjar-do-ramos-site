<?php

namespace App\Livewire;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('Entrar · Manjar do Ramos')]
class AuthPage extends Component
{
    public string $tab = 'login';

    #[Url(as: 'redirect')]
    public string $redirectTo = '';

    // Login
    public string $loginEmail = '';
    public string $loginPassword = '';

    // Registo
    public string $name = '';
    public string $email = '';
    public string $password = '';

    public function mount(): void
    {
        if (Auth::check()) {
            $this->redirect($this->redirectTarget());
        }
    }

    protected function redirectTarget(): string
    {
        // Só permite redirecionamentos internos
        $path = '/'.ltrim($this->redirectTo, '/');

        return $this->redirectTo !== '' ? $path : route('orders.mine', absolute: false);
    }

    public function login(): void
    {
        $credentials = $this->validate([
            'loginEmail' => ['required', 'email'],
            'loginPassword' => ['required'],
        ], [], ['loginEmail' => 'email', 'loginPassword' => 'palavra-passe']);

        if (! Auth::attempt(['email' => $credentials['loginEmail'], 'password' => $credentials['loginPassword']], remember: true)) {
            $this->addError('loginEmail', 'Credenciais inválidas.');

            return;
        }

        session()->regenerate();
        session()->flash('status', 'Sessão iniciada.');

        $this->redirect($this->redirectTarget());
    }

    public function register(): void
    {
        $data = $this->validate([
            'name' => ['required', 'string', 'min:1', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:72'],
        ], [], ['name' => 'nome', 'password' => 'palavra-passe']);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => User::ROLE_CUSTOMER,
        ]);

        Auth::login($user, remember: true);
        session()->regenerate();
        session()->flash('status', 'Conta criada! Sessão iniciada.');

        $this->redirect($this->redirectTarget());
    }

    public function render()
    {
        return view('livewire.auth-page');
    }
}
