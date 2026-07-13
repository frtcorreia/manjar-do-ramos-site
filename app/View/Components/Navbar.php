<?php

namespace App\View\Components;

use App\Models\SiteSetting;
use Illuminate\View\Component;
use Illuminate\View\View;

class Navbar extends Component
{
    public function __construct(public bool $forceScrolled = false)
    {
    }

    public function render(): View
    {
        $navPages = collect(SiteSetting::get('navPages', []));

        return view('components.navbar', [
            'links' => $navPages
                ->filter(fn (array $p) => ($p['visible'] ?? true) && ! in_array($p['key'], ['a-minha-conta', 'auth'], true))
                ->values(),
            'showMinhaConta' => $navPages->firstWhere('key', 'a-minha-conta')['visible'] ?? true,
            'showAuth' => $navPages->firstWhere('key', 'auth')['visible'] ?? true,
            'restaurante' => SiteSetting::get('restaurante', []),
        ]);
    }
}
