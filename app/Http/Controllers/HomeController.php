<?php

namespace App\Http\Controllers;

use App\Models\GoogleReview;
use App\Models\SiteContent;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke(): View
    {
        $blocks = collect(SiteSetting::get('blocks', []))
            ->keyBy('key')
            ->map(fn (array $block) => $block['visible'] ?? true);

        return view('home', [
            'page' => SiteContent::page('index'),
            'isVisible' => fn (string $key) => $blocks->get($key, true),
            'hero' => SiteContent::block('hero'),
            'about' => SiteContent::block('about'),
            'specialties' => SiteContent::block('specialties'),
            'gallery' => SiteContent::block('gallery'),
            'testimonialsBlock' => SiteContent::block('testimonials'),
            'reservation' => SiteContent::block('reservation'),
            'testimonials' => Testimonial::where('visible', true)->orderBy('position')->get(),
            'googleReviews' => GoogleReview::where('visible', true)->orderByDesc('publish_time')->get(),
        ]);
    }
}
