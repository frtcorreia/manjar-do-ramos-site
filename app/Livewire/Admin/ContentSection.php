<?php

namespace App\Livewire\Admin;

use App\Models\SiteContent;
use Livewire\WithFileUploads;

class ContentSection extends AdminSection
{
    use WithFileUploads;

    /** Prefixo das chaves em site_contents: block_ ou page_ */
    protected string $prefix = 'block_';

    public array $entries = [];
    public string $active = '';
    public array $data = [];

    public $imageUpload = null;
    public ?int $imageIndex = null;

    public function mount(): void
    {
        $this->entries = SiteContent::where('key', 'like', $this->prefix.'%')
            ->get()
            ->map(fn (SiteContent $content) => [
                'key' => $content->key,
                'label' => $content->value['label'] ?? $content->key,
            ])->all();

        $this->active = $this->entries[0]['key'] ?? '';
        $this->loadActive();
    }

    public function updatedActive(): void
    {
        $this->loadActive();
    }

    protected function loadActive(): void
    {
        $this->data = $this->active
            ? (SiteContent::find($this->active)?->value ?? [])
            : [];
    }

    public function uploadImageFor(int $index): void
    {
        $this->imageIndex = $index;
    }

    public function updatedImageUpload(): void
    {
        $this->validate(['imageUpload' => 'image|max:4096']);

        if ($this->imageIndex === null || ! isset($this->data['images'][$this->imageIndex])) {
            return;
        }

        $path = $this->imageUpload->store('site-assets/content', 'public');
        $this->data['images'][$this->imageIndex]['url'] = '/storage/'.$path;
        $this->imageUpload = null;
        $this->imageIndex = null;
    }

    public function save(): void
    {
        if (! $this->active) {
            return;
        }

        SiteContent::updateOrCreate(['key' => $this->active], ['value' => $this->data]);
        SiteContent::forget($this->active);
        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.content-section', [
            'title' => 'Conteúdo & Imagens',
            'subtitle' => 'Textos e imagens dos blocos da homepage.',
            'showBackground' => true,
        ]);
    }
}
