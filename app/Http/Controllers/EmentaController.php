<?php

namespace App\Http\Controllers;

use App\Models\EmentaReading;
use App\Models\MenuCategory;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EmentaController extends Controller
{
    public function __invoke(Request $request): View
    {
        // Regista uma visita por sessão (estatísticas no backoffice)
        if (! $request->session()->get('ementa_read_recorded')) {
            $request->session()->put('ementa_read_recorded', true);
            EmentaReading::create(['created_at' => now()]);
        }

        $categories = MenuCategory::with('items')
            ->orderBy('position')
            ->get()
            ->filter(fn (MenuCategory $cat) => $cat->items->contains('visible', true));

        return view('ementa', [
            'page' => SiteContent::page('ementa'),
            'categories' => $categories,
            'menuPrices' => SiteSetting::get('menuPrices', ['takeawayBox' => '0,50€', 'bag' => '0,20€']),
            'restaurante' => SiteSetting::get('restaurante', []),
        ]);
    }
}
