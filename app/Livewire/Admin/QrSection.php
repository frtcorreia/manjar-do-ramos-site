<?php

namespace App\Livewire\Admin;

use App\Models\EmentaReading;
use App\Models\QrReading;
use App\Models\QrSetting;
use App\Services\QrCodeService;

class QrSection extends AdminSection
{
    public string $tab = 'ementa';

    /** Duração editável por local: ['restaurante' => 120, …] */
    public array $durations = [];

    public array $showKey = [];

    public function mount(): void
    {
        foreach (QrSetting::all() as $setting) {
            $this->durations[$setting->location] = $setting->duration_minutes;
            $this->showKey[$setting->location] = false;
        }
    }

    public function saveDuration(string $location): void
    {
        $minutes = (int) ($this->durations[$location] ?? 0);

        if ($minutes < 1 || $minutes > 1440) {
            $this->addError("durations.$location", 'A duração deve estar entre 1 e 1440 minutos.');

            return;
        }

        QrSetting::whereKey($location)->update(['duration_minutes' => $minutes]);
        $this->saved('Duração guardada.');
    }

    public function regenerate(string $location): void
    {
        QrSetting::find($location)?->regenerate();
        $this->saved('Nova chave gerada. QRs antigos deixaram de funcionar.');
    }

    public function toggleKey(string $location): void
    {
        $this->showKey[$location] = ! ($this->showKey[$location] ?? false);
    }

    protected function stats(?string $location = null): array
    {
        $query = fn () => $location
            ? QrReading::where('location', $location)
            : EmentaReading::query();

        return [
            'today' => $query()->where('created_at', '>=', now()->startOfDay())->count(),
            'week' => $query()->where('created_at', '>=', now()->startOfWeek())->count(),
            'month' => $query()->where('created_at', '>=', now()->startOfMonth())->count(),
            'total' => $query()->count(),
        ];
    }

    public function render()
    {
        $locations = QrSetting::orderBy('location')->get()->map(fn (QrSetting $setting) => [
            'location' => $setting->location,
            'label' => QrSetting::LOCATIONS[$setting->location] ?? $setting->location,
            'secret_key' => $setting->secret_key,
            'url' => route('wines', ['key' => $setting->secret_key]),
            'qr' => QrCodeService::svg(route('wines', ['key' => $setting->secret_key])),
            'qrDownload' => QrCodeService::dataUri(route('wines', ['key' => $setting->secret_key]), 512),
            'stats' => $this->stats($setting->location),
        ]);

        return view('livewire.admin.qr-section', [
            'ementaUrl' => route('ementa'),
            'ementaQr' => QrCodeService::svg(route('ementa')),
            'ementaQrDownload' => QrCodeService::dataUri(route('ementa'), 512),
            'ementaStats' => $this->stats(),
            'locations' => $locations,
        ]);
    }
}
