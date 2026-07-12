<?php

namespace App\Http\Controllers;

use App\Models\QrReading;
use App\Models\QrSetting;
use App\Models\SiteSetting;
use App\Models\WineCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class WineListController extends Controller
{
    /**
     * A carta de vinhos só é visível depois de ler o QR code do restaurante.
     * O QR traz ?key=<segredo>; trocamo-lo por um acesso temporário em sessão.
     */
    public function show(Request $request): View|RedirectResponse
    {
        if ($key = $request->query('key')) {
            $setting = QrSetting::where('secret_key', $key)->first();

            if ($setting) {
                QrReading::create(['location' => $setting->location, 'created_at' => now()]);
                $request->session()->put(
                    'wine_access_expires_at',
                    now()->addMinutes($setting->duration_minutes)->timestamp,
                );
            }

            // Remove a chave do URL (evita partilha do link com o segredo)
            return redirect()->route('wines');
        }

        $expiresAt = $request->session()->get('wine_access_expires_at');

        if (! $expiresAt || $expiresAt < now()->timestamp) {
            $request->session()->forget('wine_access_expires_at');

            return view('wines-locked');
        }

        $categories = WineCategory::with('wines')
            ->orderBy('position')
            ->get()
            ->filter(fn (WineCategory $cat) => $cat->wines->contains('visible', true));

        return view('wines', [
            'categories' => $categories,
            'meta' => SiteSetting::get('winesMeta', []),
        ]);
    }
}
