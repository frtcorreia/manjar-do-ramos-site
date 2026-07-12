<?php

use App\Http\Controllers\CateringController;
use App\Http\Controllers\EmentaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\MyOrdersController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\WineListController;
use App\Livewire\AdminShell;
use App\Livewire\AuthPage;
use App\Livewire\Checkout;
use App\Livewire\OrderMenu;
use App\Livewire\WineTablet;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/ementa', EmentaController::class)->name('ementa');
Route::get('/catering', CateringController::class)->name('catering');

Route::get('/carta-de-vinhos', [WineListController::class, 'show'])->name('wines');
Route::get('/carta-de-vinhos-tablet', WineTablet::class)->name('wines.tablet');

Route::get('/encomendas', OrderMenu::class)->name('orders.menu');
Route::get('/checkout', Checkout::class)->name('checkout');

Route::get('/auth', AuthPage::class)->name('auth');
Route::post('/logout', LogoutController::class)->name('logout');

Route::get('/minhas-encomendas', MyOrdersController::class)
    ->middleware('auth')
    ->name('orders.mine');

Route::get('/admin', AdminShell::class)->name('admin');

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
