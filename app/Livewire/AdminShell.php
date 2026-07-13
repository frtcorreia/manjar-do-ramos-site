<?php

namespace App\Livewire;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('Backoffice · Manjar do Ramos')]
class AdminShell extends Component
{
    public const SECTIONS = [
        'restaurante' => 'Restaurante',
        'navegacao' => 'Navegação & Site',
        'pages' => 'Páginas',
        'menu' => 'Ementa',
        'wines' => 'Carta de Vinhos',
        'qr' => 'Leituras QR',
        'orders' => 'Encomendas',
        'testimonials' => 'Testemunhos',
        'google-reviews' => 'Google Reviews',
        'content' => 'Conteúdo & Imagens',
    ];

    #[Url(as: 'seccao')]
    public string $section = 'restaurante';

    // Login de administrador (quando não autenticado)
    public string $email = '';
    public string $password = '';

    public function select(string $section): void
    {
        if (array_key_exists($section, self::SECTIONS)) {
            $this->section = $section;
        }
    }

    public function login(): void
    {
        $credentials = $this->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [], ['password' => 'palavra-passe']);

        if (! Auth::attempt($credentials, remember: true)) {
            $this->addError('email', 'Credenciais inválidas.');

            return;
        }

        session()->regenerate();
        $this->redirectRoute('admin');
    }

    public function render()
    {
        $restaurante = SiteSetting::get('restaurante', []);

        return view('livewire.admin-shell', [
            'sections' => self::SECTIONS,
            'logo' => ($restaurante['logo'] ?? '') ?: '/images/logo-cream.png',
        ]);
    }
}
