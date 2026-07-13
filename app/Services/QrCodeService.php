<?php

namespace App\Services;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class QrCodeService
{
    /** Gera um QR code em SVG (string) para o URL indicado. */
    public static function svg(string $url, int $size = 240): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size, 2),
            new SvgImageBackEnd(),
        );

        return (new Writer($renderer))->writeString($url);
    }

    /** Versão data-URI, útil para <img src> e download. */
    public static function dataUri(string $url, int $size = 512): string
    {
        return 'data:image/svg+xml;base64,'.base64_encode(self::svg($url, $size));
    }
}
