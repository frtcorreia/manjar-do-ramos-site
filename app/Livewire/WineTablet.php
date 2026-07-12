<?php

namespace App\Livewire;

use App\Models\WineCategory;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('Carta de Vinhos · Manjar do Ramos')]
class WineTablet extends Component
{
    public bool $unlocked = false;

    public function mount(): void
    {
        $this->unlocked = (bool) session('wine_tablet_unlocked', false);
    }

    public function checkPin(string $pin): bool
    {
        if (hash_equals((string) config('manjar.wine_tablet_pin'), $pin)) {
            session()->put('wine_tablet_unlocked', true);
            $this->unlocked = true;

            return true;
        }

        return false;
    }

    public function render()
    {
        $categories = $this->unlocked
            ? WineCategory::with(['wines' => fn ($q) => $q->where('visible', true)])
                ->orderBy('position')
                ->get()
                ->filter(fn (WineCategory $cat) => $cat->wines->isNotEmpty())
                ->values()
            : collect();

        return view('livewire.wine-tablet', ['categories' => $categories]);
    }
}
