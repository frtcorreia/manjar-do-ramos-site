<?php

if (! function_exists('price_to_decimal')) {
    /**
     * Converte um preço em texto livre ("18,00€ p/p", "1.50 €") para float.
     * Réplica do parsePrice do site antigo.
     */
    function price_to_decimal(?string $price): float
    {
        if ($price === null || $price === '') {
            return 0.0;
        }

        $clean = preg_replace('/[^\d,.\-]/', '', $price) ?? '';
        $clean = str_replace(',', '.', $clean);

        // "1.234.56" → mantém apenas o último separador decimal
        if (substr_count($clean, '.') > 1) {
            $pos = strrpos($clean, '.');
            $clean = str_replace('.', '', substr($clean, 0, $pos)).substr($clean, $pos);
        }

        return is_numeric($clean) ? (float) $clean : 0.0;
    }
}

if (! function_exists('format_eur')) {
    /** Formata um valor como euros em pt-PT (ex.: "12,50 €"). */
    function format_eur(float|string|null $value): string
    {
        $value = (float) ($value ?? 0);

        if (class_exists(\NumberFormatter::class)) {
            $formatter = new \NumberFormatter('pt_PT', \NumberFormatter::CURRENCY);

            return $formatter->formatCurrency($value, 'EUR');
        }

        return number_format($value, 2, ',', ' ').' €';
    }
}
