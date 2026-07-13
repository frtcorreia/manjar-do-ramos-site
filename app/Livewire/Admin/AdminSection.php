<?php

namespace App\Livewire\Admin;

use Livewire\Component;

/**
 * Base das secções do backoffice. O boot() corre em todos os pedidos
 * Livewire (incluindo ações), garantindo que só administradores chegam
 * às ações destes componentes.
 */
abstract class AdminSection extends Component
{
    public function boot(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403);
    }

    protected function saved(string $message = 'Alterações guardadas.'): void
    {
        $this->dispatch('admin-saved', message: $message);
    }
}
