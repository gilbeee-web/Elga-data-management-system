<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SalesReportExport implements FromView, ShouldAutoSize
{
    use Exportable;

    private Collection $transactions;
    private float $totalSales;

    public function __construct(Collection $transactions, float $totalSales)
    {
        $this->transactions = $transactions;
        $this->totalSales = $totalSales;
    }

    public function view(): \Illuminate\Contracts\View\View
    {
        return view('reports.excel', [
            'transactions' => $this->transactions,
            'totalSales' => $this->totalSales,
        ]);
    }
}