<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class MyOrdersController extends Controller
{
    public function __invoke(Request $request): View
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->get();

        return view('my-orders', ['orders' => $orders]);
    }
}
