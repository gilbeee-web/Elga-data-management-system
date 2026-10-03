<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Shipment;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //

    public function index(Request $request){

        $period = $request->period ?? 'today';
        $view   = $request->view ?? 'daily'; 

        $range = match($period) {
            'weekly'  => [now()->startOfWeek(), now()->endOfWeek()],
            'monthly' => [now()->startOfMonth(), now()->endOfMonth()],
            'yearly'  => [now()->startOfYear(), now()->endOfYear()],
            default => [now()->startOfDay(), now()->endOfDay()],
        };

        $totalPaymentsCollected = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
            ->where('orders.shop_id', session('shop_id'))
            ->whereBetween('orders.completed_at', $range)->sum('payment_amount');

        $totalSales = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.shop_id', session('shop_id'))
            ->where('orders.order_status', 'shipped')
            ->whereBetween('orders.completed_at', $range)
            ->sum('order_items.subtotal');
        
        $totalOrders = Order::where('shop_id', session('shop_id'))->whereBetween('created_at', $range)->count();

        // $pendingOrders = Order::where('shop_id', session('shop_id'))->whereIn('order_status', [
        //     'processing', 'awaiting_payment', 'payment_confirmed'
        // ])->count();

        $totalSfCollected = Shipment::join('orders', 'shipments.order_id', '=', 'orders.id')
            ->where('orders.shop_id', session('shop_id'))
            ->whereBetween('shipments.shipped_at', $range)
            ->sum('shipments.total_shipping_fee');

        
        $recentOrders = Order::with('references')
            ->where('orders.shop_id', session('shop_id'))
            ->latest()->take(5)->get();


        // ----- Sales Trend Chart -----
        $trendDays = match($view) {
            'weekly'  => 90,
            'monthly' => 365,
            default   => 30,
        };

        $trendFormat = match($view) {
            'weekly'  => '%x-%v',
            'monthly' => '%Y-%m',
            default   => '%Y-%m-%d',
        };

        $salesTrend = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
            ->selectRaw("DATE_FORMAT(paid_at, '{$trendFormat}') as period, SUM(payment_amount) as total")
            ->where('paid_at', '>=', now()->subDays($trendDays))
            ->where('orders.shop_id', session('shop_id'))
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // ----- Order Status Breakdown -----
        $orderStatusBreakdown = Order::where('shop_id', session('shop_id'))
            ->selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->get();


        return Inertia::render('Dashboard', [
            'summaryCards' => [
                'totalSales' => $totalSales, //item or product sales
                'totalOrders' => $totalOrders,
                'totalPaymentsCollected' => $totalPaymentsCollected,
                'totalSfCollected' => $totalSfCollected,
            ],
            // 'pendingOrders' => $pendingOrders,
            'recentOrders' => $recentOrders,
            'salesTrend' => $salesTrend,
            'orderStatusDistribution' => $orderStatusBreakdown,
            'view' => $view,
            'user' => Auth::user()
        ]);
    }
}
