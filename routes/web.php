<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Models\Customer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::middleware('auth')->group(function(){
    Route::prefix('/dashboard')->group(function(){
        Route::controller(DashboardController::class)->group(function(){
            Route::get('/', 'index')->name('dashboard.index');
        });
    });
});


Route::get('/', function(){
    return Inertia::render('Index');
})->name('index');

Route::middleware('auth')->group(function(){
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
});



Route::middleware('auth')->group(function(){
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
});

Route::prefix('/users')->controller(UserController::class)->group(function () {
    Route::post('/login', 'login')->name('user.login');
});

Route::middleware('auth')->group(function(){
    Route::prefix('/users')->group(function(){
        Route::controller(UserController::class)->group(function(){
            Route::get('/', 'index')->name('user.index');
            Route::get('/edit', 'edit')->name('user.edit');
            Route::post('/', 'store')->name('user.store');
            Route::post('/logout', 'logout')->name('user.logout');
            Route::put('/{user}', 'update')->name('user.update');
            Route::put('/{user}/credentials', 'updateCredentials')->name('user.updateCredentials');
            Route::delete('/{user}', 'destroy')->name('user.destroy');
            
        });
    });
});


Route::middleware('auth')->group(function(){
    Route::prefix('/reports')->group(function(){
        Route::controller(ReportController::class)->group(function(){
            Route::get('/', 'index')->name('report.index');
            Route::get('/export/pdf', 'exportPdf')->name('report.export.pdf');
            Route::get('/export/excel', 'exportExcel')->name('report.export.excel');       
        });
    });
});


