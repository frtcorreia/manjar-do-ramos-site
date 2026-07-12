<?php

namespace App\View\Components;

use App\Models\SiteSetting;
use Illuminate\View\Component;
use Illuminate\View\View;

class Footer extends Component
{
    public function render(): View
    {
        $navPages = collect(SiteSetting::get('navPages', []));

        return view('components.footer', [
            'links' => $navPages
                ->filter(fn (array $p) => ($p['visible'] ?? true) && ! in_array($p['key'], ['a-minha-conta', 'auth'], true))
                ->values(),
            'r' => SiteSetting::get('restaurante', []),
        ]);
    }
}
