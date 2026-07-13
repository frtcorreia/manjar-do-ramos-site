<?php

namespace App\Livewire\Admin;

use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;

class TestimonialsSection extends AdminSection
{
    public array $testimonials = [];

    public function mount(): void
    {
        $this->load();
    }

    protected function load(): void
    {
        $this->testimonials = Testimonial::orderBy('position')
            ->get()
            ->map(fn (Testimonial $t) => [
                'id' => $t->id,
                'quote' => $t->quote,
                'name' => $t->name,
                'context' => $t->context,
                'visible' => $t->visible,
            ])->all();
    }

    public function add(): void
    {
        Testimonial::create([
            'quote' => '',
            'name' => 'Novo testemunho',
            'context' => '',
            'position' => count($this->testimonials),
        ]);
        $this->load();
    }

    public function delete(int $id): void
    {
        Testimonial::whereKey($id)->delete();
        $this->load();
        $this->saved('Testemunho removido.');
    }

    public function save(): void
    {
        DB::transaction(function () {
            foreach ($this->testimonials as $position => $t) {
                Testimonial::whereKey($t['id'])->update([
                    'quote' => $t['quote'] ?? '',
                    'name' => $t['name'] ?: 'Anónimo',
                    'context' => $t['context'] ?? '',
                    'visible' => (bool) $t['visible'],
                    'position' => $position,
                ]);
            }
        });

        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.testimonials-section');
    }
}
