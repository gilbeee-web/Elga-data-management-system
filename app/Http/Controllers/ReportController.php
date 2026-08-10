<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Shipment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    //

    public function index(Request $request){

        $validated = $request->validate([
            'period' => 'nullable|in:daily,weekly,monthly,yearly,custom',
            'dateFrom' => 'nullable|date|required_if:period,custom',
            'dateTo' => 'nullable|date|required_if:period,custom|after_or_equal:dateFrom',
            'sort_by' => 'nullable|in:paid_at,payment_amount,payment_type,payment_method',
            'sort_direction' => 'nullable|in:asc,desc',
            'search' => 'nullable|string|max:255',
        ]);


        $period = $validated['period'] ?? null;
        $sortBy = $validated['sort_by'] ?? 'paid_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc'; 
        
        $range = match($period) {
            'daily' => [now()->startOfDay(), now()->endOfDay()],
            'weekly'  => [now()->startOfWeek(), now()->endOfWeek()],
            'monthly' => [now()->startOfMonth(), now()->endOfMonth()],
            'yearly'  => [now()->startOfYear(), now()->endOfYear()],
            'custom' => [
                Carbon::parse($request->dateFrom)->startOfDay(),
                Carbon::parse($request->dateTo)->endOfDay(),
            ],
            default => null,
        };

    
        $salesQuery = Payment::query();
        $shipmentQuery = Shipment::query();

        $allowedSorts = ['paid_at', 'payment_amount', 'payment_type', 'payment_method'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'paid_at';
        }

        $transactionsQuery = Payment::with('order.customer')->orderBy($sortBy, $sortDirection === 'asc' ? 'asc' : 'desc');

        if ($range) {
            $salesQuery->whereBetween('paid_at', $range);
            $shipmentQuery->whereBetween('shipped_at', $range);
            $transactionsQuery->whereBetween('paid_at', $range);
        }

        $totalSales = $salesQuery->sum('payment_amount');
        $totalSfCollected = $shipmentQuery->sum('raw_shipping_fee');

        if ($request->filled('search')) {
            $search = $request->search;

            $transactionsQuery->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', '%' . $search . '%')
                ->orWhereHas('order', function ($orderQuery) use ($search) {
                    $orderQuery->where('transaction_number', 'like', '%' . $search . '%')
                                ->orWhere('sender_name', 'like', '%' . $search . '%');
                });
            });
        }

        $totalTransactions = (clone $transactionsQuery)->count();

        $summaryCards = [
            'totalSales' => $totalSales,
            'totalTransactions' => $totalTransactions,
            'totalSfCollected' => $totalSfCollected
        ];

        $transactions = $transactionsQuery->paginate(10)->withQueryString(); //keep filtering across the pagination


        return Inertia::render('Reports', [
            'summaryCards' => $summaryCards,
            'transactions' => $transactions,
            'filters' => [
                'period' => $period,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'dateFrom' => $request->dateFrom,
                'dateTo' => $request->dateTo,
            ],
        ]);

    }

}
