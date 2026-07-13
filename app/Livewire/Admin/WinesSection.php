<?php

namespace App\Livewire\Admin;

use App\Models\SiteSetting;
use App\Models\Wine;
use App\Models\WineCategory;
use Illuminate\Support\Facades\DB;
use Livewire\WithFileUploads;

class WinesSection extends AdminSection
{
    use WithFileUploads;

    public array $meta = [];
    public array $categories = [];

    public ?int $openCategory = null;

    public $imageUpload = null;
    public ?string $imageTarget = null;

    public function mount(): void
    {
        $this->meta = SiteSetting::get('winesMeta', ['eyebrow' => '', 'title' => '', 'subtitle' => '']);
        $this->load();
    }

    protected function load(): void
    {
        $this->categories = WineCategory::with('wines')
            ->orderBy('position')
            ->get()
            ->map(fn (WineCategory $cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'wines' => $cat->wines->map(fn (Wine $wine) => [
                    'id' => $wine->id,
                    'name' => $wine->name,
                    'producer' => $wine->producer,
                    'region' => $wine->region,
                    'year' => $wine->year,
                    'price' => $wine->price,
                    'image' => $wine->image,
                    'notes' => $wine->notes,
                    'visible' => $wine->visible,
                ])->all(),
            ])->all();

        $this->openCategory ??= $this->categories[0]['id'] ?? null;
    }

    public function addCategory(): void
    {
        $category = WineCategory::create(['name' => 'Nova categoria', 'position' => count($this->categories)]);
        $this->load();
        $this->openCategory = $category->id;
    }

    public function deleteCategory(int $id): void
    {
        WineCategory::whereKey($id)->delete();
        if ($this->openCategory === $id) {
            $this->openCategory = null;
        }
        $this->load();
        $this->saved('Categoria removida.');
    }

    public function moveCategory(int $index, int $direction): void
    {
        $target = $index + $direction;
        if (! isset($this->categories[$index], $this->categories[$target])) {
            return;
        }
        [$this->categories[$index], $this->categories[$target]] = [$this->categories[$target], $this->categories[$index]];
        $this->persistPositions();
    }

    public function addWine(int $categoryIndex): void
    {
        $category = $this->categories[$categoryIndex] ?? null;
        if (! $category) {
            return;
        }

        Wine::create([
            'wine_category_id' => $category['id'],
            'name' => 'Novo vinho',
            'position' => count($category['wines']),
        ]);
        $this->load();
    }

    public function deleteWine(int $id): void
    {
        Wine::whereKey($id)->delete();
        $this->load();
        $this->saved('Vinho removido.');
    }

    public function moveWine(int $categoryIndex, int $index, int $direction): void
    {
        $wines = &$this->categories[$categoryIndex]['wines'];
        $target = $index + $direction;
        if (! isset($wines[$index], $wines[$target])) {
            return;
        }
        [$wines[$index], $wines[$target]] = [$wines[$target], $wines[$index]];
        $this->persistPositions();
    }

    public function uploadImageFor(string $target): void
    {
        $this->imageTarget = $target;
    }

    public function updatedImageUpload(): void
    {
        $this->validate(['imageUpload' => 'image|max:4096']);

        if ($this->imageTarget === null) {
            return;
        }

        [$catIndex, $wineIndex] = explode('.', $this->imageTarget);
        $path = $this->imageUpload->store('site-assets/wines', 'public');
        $this->categories[(int) $catIndex]['wines'][(int) $wineIndex]['image'] = '/storage/'.$path;
        $this->imageUpload = null;
        $this->imageTarget = null;
    }

    protected function persistPositions(): void
    {
        DB::transaction(function () {
            foreach ($this->categories as $catPosition => $category) {
                WineCategory::whereKey($category['id'])->update(['position' => $catPosition]);
                foreach ($category['wines'] as $winePosition => $wine) {
                    Wine::whereKey($wine['id'])->update(['position' => $winePosition]);
                }
            }
        });
    }

    public function save(): void
    {
        SiteSetting::put('winesMeta', $this->meta);

        DB::transaction(function () {
            foreach ($this->categories as $catPosition => $category) {
                WineCategory::whereKey($category['id'])->update([
                    'name' => $category['name'] ?: 'Sem nome',
                    'position' => $catPosition,
                ]);

                foreach ($category['wines'] as $winePosition => $wine) {
                    Wine::whereKey($wine['id'])->update([
                        'name' => $wine['name'] ?: 'Sem nome',
                        'producer' => $wine['producer'] ?? '',
                        'region' => $wine['region'] ?? '',
                        'year' => $wine['year'] ?? '',
                        'price' => $wine['price'] ?? '',
                        'image' => $wine['image'] ?? '',
                        'notes' => $wine['notes'] ?? '',
                        'visible' => (bool) $wine['visible'],
                        'position' => $winePosition,
                    ]);
                }
            }
        });

        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.wines-section', ['regions' => Wine::REGIONS]);
    }
}
