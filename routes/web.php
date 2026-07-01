<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');


// Route::prefix('/orders')
//     ->middleware(['auth'])->group(function(){
//         Route::controller(OrderController::class)->group(function(){
//             Route::get('/', 'index')->name('order.index');
//         });
//     });

Route::prefix('/orders')->group(function(){
    Route::controller(OrderController::class)->group(function(){
        Route::get('/', 'index')->name('order.index');
        Route::get('/create', 'create')->name('order.create');
        Route::post('/', 'store')->name('order.store');
    });
});

   

