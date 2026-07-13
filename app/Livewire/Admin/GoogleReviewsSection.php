<?php

namespace App\Livewire\Admin;

use App\Models\GoogleReview;
use App\Models\SiteSetting;
use App\Services\GoogleReviewsService;
use Throwable;

class GoogleReviewsSection extends AdminSection
{
    public string $placeId = '';
    public string $searchQuery = '';
    public array $searchResults = [];
    public string $feedback = '';
    public string $error = '';

    public function mount(): void
    {
        $this->placeId = SiteSetting::get('restaurante', [])['googlePlaceId'] ?? '';
    }

    public function search(GoogleReviewsService $service): void
    {
        $this->reset('feedback', 'error', 'searchResults');

        if (trim($this->searchQuery) === '') {
            return;
        }

        try {
            $this->searchResults = $service->findPlaceId($this->searchQuery);
            if ($this->searchResults === []) {
                $this->feedback = 'Sem resultados para essa pesquisa.';
            }
        } catch (Throwable $e) {
            $this->error = $e->getMessage();
        }
    }

    public function usePlaceId(string $placeId): void
    {
        $this->placeId = $placeId;
        $this->savePlaceId();
    }

    public function savePlaceId(): void
    {
        $restaurante = SiteSetting::get('restaurante', []);
        $restaurante['googlePlaceId'] = trim($this->placeId);
        SiteSetting::put('restaurante', $restaurante);
        $this->saved('Place ID guardado.');
    }

    public function sync(GoogleReviewsService $service): void
    {
        $this->reset('feedback', 'error');

        if (trim($this->placeId) === '') {
            $this->error = 'Defina primeiro o Place ID do restaurante.';

            return;
        }

        try {
            $count = $service->sync(trim($this->placeId));
            $this->feedback = "{$count} reviews sincronizadas.";
        } catch (Throwable $e) {
            $this->error = $e->getMessage();
        }
    }

    public function toggleVisible(string $reviewId): void
    {
        if ($review = GoogleReview::find($reviewId)) {
            $review->update(['visible' => ! $review->visible]);
        }
    }

    public function delete(string $reviewId): void
    {
        GoogleReview::whereKey($reviewId)->delete();
        $this->saved('Review removida.');
    }

    public function render()
    {
        return view('livewire.admin.google-reviews-section', [
            'reviews' => GoogleReview::orderByDesc('publish_time')->get(),
        ]);
    }
}
