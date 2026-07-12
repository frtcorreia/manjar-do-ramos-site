<?php

namespace App\Models;

/**
 * Acesso conveniente aos fields/images de um SiteContent nas views:
 * $bag->field('Título', 'fallback'), $bag->image('Imagem 1', $default).
 */
class ContentBag
{
    public function __construct(protected array $data)
    {
    }

    public function field(string $label, string $fallback = ''): string
    {
        foreach ($this->data['fields'] ?? [] as $field) {
            if (($field['label'] ?? null) === $label && ($field['value'] ?? '') !== '') {
                return $field['value'];
            }
        }

        return $fallback;
    }

    public function image(string $label, string $fallback = ''): string
    {
        foreach ($this->data['images'] ?? [] as $image) {
            if (($image['label'] ?? null) === $label && ($image['url'] ?? '') !== '') {
                return $image['url'];
            }
        }

        return $fallback;
    }

    /** @return array<int, array{id:string,label:string,url:string,title?:string,description?:string}> */
    public function images(): array
    {
        return $this->data['images'] ?? [];
    }

    public function backgroundColor(): string
    {
        return $this->data['backgroundColor'] ?? '';
    }

    public function isEmpty(): bool
    {
        return $this->data === [];
    }
}
