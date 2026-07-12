<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use Illuminate\View\View;

class CateringController extends Controller
{
    public function __invoke(): View
    {
        return view('catering', [
            'page' => SiteContent::page('catering'),
        ]);
    }
}
