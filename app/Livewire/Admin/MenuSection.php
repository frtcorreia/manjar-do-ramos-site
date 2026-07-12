<?php

namespace App\Livewire\Admin;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;
use Livewire\WithFileUploads;

class MenuSection extends AdminSection
{
    use WithFileUploads;

    /** Estrutura editável: [['id','name','items' => [['id','name','description','price','image','delivery','takeaway','restaurant','visible','allergens'], …]], …] */
    public array $categories = [];

    public ?int $openCategory = null;

    public $imageUpload = null;
    public ?string $imageTarget = null; // "catIndex.itemIndex"

    public function mount(): void
    {
        $this->load();
    }

    protected function load(): void
    {
        $this->categories = MenuCategory::with('items')
            ->orderBy('position')
            ->get()
            ->map(fn (MenuCategory $cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'items' => $cat->items->map(fn (MenuItem $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'image' => $item->image,
                    'delivery' => $item->delivery,
                    'takeaway' => $item->takeaway,
                    'restaurant' => $item->restaurant,
                    'visible' => $item->visible,
                    'allergens' => $item->allergens ?? [],
                ])->all(),
            ])->all();

        $this->openCategory ??= $this->categories[0]['id'] ?? null;
    }

    public function addCategory(): void
    {
        $category = MenuCategory::create([
            'name' => 'Nova categoria',
            'position' => count($this->categories),
        ]);
        $this->load();
        $this->openCategory = $category->id;
    }

    public function deleteCategory(int $id): void
    {
        MenuCategory::whereKey($id)->delete();
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

    public function addItem(int $categoryIndex): void
    {
        $category = $this->categories[$categoryIndex] ?? null;
        if (! $category) {
            return;
        }

        MenuItem::create([
            'menu_category_id' => $category['id'],
            'name' => 'Novo prato',
            'allergens' => [],
            'position' => count($category['items']),
        ]);
        $this->load();
    }

    public function deleteItem(int $id): void
    {
        MenuItem::whereKey($id)->delete();
        $this->load();
        $this->saved('Prato removido.');
    }

    public function moveItem(int $categoryIndex, int $index, int $direction): void
    {
        $items = &$this->categories[$categoryIndex]['items'];
        $target = $index + $direction;
        if (! isset($items[$index], $items[$target])) {
            return;
        }
        [$items[$index], $items[$target]] = [$items[$target], $items[$index]];
        $this->persistPositions();
    }

    public function toggleAllergen(int $categoryIndex, int $itemIndex, string $allergen): void
    {
        $allergens = $this->categories[$categoryIndex]['items'][$itemIndex]['allergens'] ?? [];

        $this->categories[$categoryIndex]['items'][$itemIndex]['allergens'] = in_array($allergen, $allergens, true)
            ? array_values(array_diff($allergens, [$allergen]))
            : [...$allergens, $allergen];
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

        [$catIndex, $itemIndex] = explode('.', $this->imageTarget);
        $path = $this->imageUpload->store('site-assets/menu', 'public');
        $this->categories[(int) $catIndex]['items'][(int) $itemIndex]['image'] = '/storage/'.$path;
        $this->imageUpload = null;
        $this->imageTarget = null;
    }

    protected function persistPositions(): void
    {
        DB::transaction(function () {
            foreach ($this->categories as $catPosition => $category) {
                MenuCategory::whereKey($category['id'])->update(['position' => $catPosition]);
                foreach ($category['items'] as $itemPosition => $item) {
                    MenuItem::whereKey($item['id'])->update(['position' => $itemPosition]);
                }
            }
        });
    }

    public function save(): void
    {
        DB::transaction(function () {
            foreach ($this->categories as $catPosition => $category) {
                MenuCategory::whereKey($category['id'])->update([
                    'name' => $category['name'] ?: 'Sem nome',
                    'position' => $catPosition,
                ]);

                foreach ($category['items'] as $itemPosition => $item) {
                    MenuItem::whereKey($item['id'])->update([
                        'name' => $item['name'] ?: 'Sem nome',
                        'description' => $item['description'] ?? '',
                        'price' => $item['price'] ?? '',
                        'image' => $item['image'] ?? '',
                        'delivery' => (bool) $item['delivery'],
                        'takeaway' => (bool) $item['takeaway'],
                        'restaurant' => (bool) $item['restaurant'],
                        'visible' => (bool) $item['visible'],
                        'allergens' => array_values($item['allergens'] ?? []),
                        'position' => $itemPosition,
                    ]);
                }
            }
        });

        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.menu-section', [
            'allergenOptions' => MenuItem::ALLERGENS,
        ]);
    }
}
