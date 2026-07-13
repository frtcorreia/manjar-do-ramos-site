<?php

namespace App\Livewire\Admin;

use App\Models\SiteSetting;
use Livewire\WithFileUploads;

class RestauranteSection extends AdminSection
{
    use WithFileUploads;

    public array $r = [];

    public $logoUpload = null;

    public function mount(): void
    {
        $this->r = SiteSetting::get('restaurante', [
            'logo' => '', 'nomeProprietario' => '', 'nif' => '', 'morada' => '',
            'telefone' => '', 'email' => '', 'horario' => '', 'horarioRestaurante' => '',
            'horarioPatio' => '', 'googleMapsUrl' => '', 'googleMapsEmbed' => '', 'googlePlaceId' => '',
            'social' => [
                'instagram' => ['url' => '', 'visible' => false],
                'facebook' => ['url' => '', 'visible' => false],
                'tripadvisor' => ['url' => '', 'visible' => false],
            ],
        ]);
    }

    public function updatedLogoUpload(): void
    {
        $this->validate(['logoUpload' => 'image|max:4096']);

        $path = $this->logoUpload->store('site-assets/logo', 'public');
        $this->r['logo'] = '/storage/'.$path;
        $this->logoUpload = null;
    }

    public function removeLogo(): void
    {
        $this->r['logo'] = '';
    }

    public function save(): void
    {
        SiteSetting::put('restaurante', $this->r);
        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.restaurante-section');
    }
}
