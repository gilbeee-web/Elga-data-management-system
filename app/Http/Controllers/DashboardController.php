<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Shipment;
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
            'week'  => [now()->startOfWeek(), now()->endOfWeek()],
            'month' => [now()->startOfMonth(), now()->endOfMonth()],
            'year'  => [now()->startOfYear(), now()->endOfYear()],
            default => [now()->startOfDay(), now()->endOfDay()],
        };

        $totalSales = Payment::whereBetween('paid_at', $range)->sum('payment_amount');
        $totalOrders = Order::whereBetween('created_at', $range)->count();
        $pendingOrders = Order::whereIn('order_status', [
            'processing', 'awaiting_payment', 'payment_confirmed'
        ])->count();

        $totalSfCollected = Shipment::whereBetween('shipped_at', $range)->sum('raw_shipping_fee');
        $recentOrders = Order::with('references')->latest()->take(5)->get();


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

        $salesTrend = Payment::selectRaw("DATE_FORMAT(paid_at, '{$trendFormat}') as period, SUM(payment_amount) as total")
            ->where('paid_at', '>=', now()->subDays($trendDays))
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // ----- Order Status Breakdown -----
        $orderStatusBreakdown = Order::selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->get();


        return Inertia::render('Dashboard', [
            'totalSales' => $totalSales,
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'totalSfCollected' => $totalSfCollected,
            'recentOrders' => $recentOrders,
            'salesTrend' => $salesTrend,
            'orderStatusDistribution' => $orderStatusBreakdown,
            'view' => $view,
            'user' => Auth::user()
        ]);
    }
}
