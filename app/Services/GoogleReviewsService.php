<?php

namespace App\Services;

use App\Models\GoogleReview;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GoogleReviewsService
{
    protected function apiKey(): string
    {
        $key = config('services.google.places_key');

        if (! $key) {
            throw new RuntimeException('GOOGLE_PLACES_API_KEY não configurada no servidor.');
        }

        return $key;
    }

    /** Importa as reviews de um Place ID para a tabela google_reviews. */
    public function sync(string $placeId): int
    {
        $response = Http::withHeaders([
            'X-Goog-Api-Key' => $this->apiKey(),
            'X-Goog-FieldMask' => 'reviews',
        ])->get("https://places.googleapis.com/v1/places/{$placeId}", [
            'languageCode' => 'pt',
        ]);

        if ($response->failed()) {
            throw new RuntimeException("Google Places API error ({$response->status()}): {$response->body()}");
        }

        $reviews = $response->json('reviews') ?? [];
        $now = now();

        foreach ($reviews as $review) {
            GoogleReview::updateOrCreate(
                ['id' => $review['name'] ?? 'review_'.uniqid()],
                [
                    'author_name' => $review['authorAttribution']['displayName'] ?? 'Anónimo',
                    'rating' => $review['rating'] ?? 5,
                    'text' => $review['text']['text'] ?? '',
                    'relative_time_description' => $review['relativePublishTimeDescription'] ?? '',
                    'profile_photo_url' => $review['authorAttribution']['photoUri'] ?? '',
                    'publish_time' => $review['publishTime'] ?? null,
                    'fetched_at' => $now,
                ],
            );
        }

        return count($reviews);
    }

    /**
     * Pesquisa Place IDs por texto livre.
     *
     * @return array<int, array{placeId: string, name: string, address: string}>
     */
    public function findPlaceId(string $query): array
    {
        $response = Http::withHeaders([
            'X-Goog-Api-Key' => $this->apiKey(),
            'X-Goog-FieldMask' => 'places.id,places.displayName,places.formattedAddress',
        ])->post('https://places.googleapis.com/v1/places:searchText', [
            'textQuery' => $query,
        ]);

        if ($response->failed()) {
            throw new RuntimeException("Google Places API error ({$response->status()}): {$response->body()}");
        }

        return collect($response->json('places') ?? [])->map(fn (array $place) => [
            'placeId' => $place['id'],
            'name' => $place['displayName']['text'] ?? '',
            'address' => $place['formattedAddress'] ?? '',
        ])->all();
    }
}
