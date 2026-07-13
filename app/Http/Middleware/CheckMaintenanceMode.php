<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Modo de manutenção gerido no backoffice (site_settings.maintenance).
 * Administradores e as rotas /admin, /auth e /livewire continuam acessíveis.
 */
class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        $maintenance = SiteSetting::get('maintenance', ['enabled' => false]);

        if (! ($maintenance['enabled'] ?? false)) {
            return $next($request);
        }

        if ($request->user()?->isAdmin()) {
            return $next($request);
        }

        if ($request->is('admin*', 'auth*', 'livewire/*', 'logout', 'up', 'storage/*')) {
            return $next($request);
        }

        return response()->view('maintenance', ['maintenance' => $maintenance], 503);
    }
}
