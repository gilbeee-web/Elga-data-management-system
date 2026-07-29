<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Models\Customer;
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
        Route::get('/save-customers', 'getSaveCustomers')->name('order.getSaveCustomers');
        Route::post('/draft', 'saveDraft')->name('order.saveDraft');
        Route::get('/{order}/edit', 'edit')->name('order.edit');
        Route::post('/{order}/customer', 'saveCustomer')->name('order.customer.save');
        Route::post('/{order}/save-order', 'saveOrderItem')->name('order.saveOrderItem');
        Route::post('/{order}/save-shipping-info', 'saveShippingInfo')->name('order.saveShippingInfo');
        Route::post('/{order}/save-payment', 'savePayment')->name('order.savePayment');
        Route::post('/{order}/shipped', 'shippedOrder')->name('order.shippedOrder');
        Route::delete('/{order}/{payment_id}', 'destroyPayment')->name('order.destroyPayment');
    });
});



Route::prefix('/products')->group(function(){
    Route::controller(ProductController::class)->group(function(){
        Route::get('/', 'index')->name('product.index');
        Route::get('/create', 'create')->name('product.create');
        Route::get('/{id}/view', 'view')->name('product.view');
        Route::get('/{id}/edit', 'edit')->name('product.edit');
        Route::get('/get-products', 'getAllProducts')->name('product.getAllProducts');
        Route::post('/', 'store')->name('product.store');
        Route::put('/{product}', 'update')->name('product.update');
        Route::put('/{product}/disable', 'disableProduct')->name('product.disable');
        Route::delete('/{product}', 'destroy')->name('product.destroy');
    });
});

   

