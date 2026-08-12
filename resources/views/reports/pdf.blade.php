<!DOCTYPE html>
<html>
    <head>
        <style>
            body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            .meta { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
            th { background-color: #f3f3f3; }
            .summary { margin-bottom: 15px; font-weight: bold; }
            .text-right { text-align: right; }
        </style>
    </head>
    <body>
        <h1>Sales Report</h1>
        <div class="meta">
            Generated on {{ $generatedAt->format('F d, Y h:i A') }}
            @if($period === 'custom')
                &middot; {{ \Carbon\Carbon::parse($dateFrom)->format('M d, Y') }} - {{ \Carbon\Carbon::parse($dateTo)->format('M d, Y') }}
            @elseif($period)
                &middot; {{ ucfirst($period) }}
            @else
                &middot; All Time
            @endif
        </div>

        <div class="summary">
            Total Sales: ₱{{ number_format($totalSales, 2) }} &nbsp;|&nbsp; Total Transactions: {{ $transactions->count() }}
        </div>

        <table>
            <thead>
                <tr>
                    <th>Transaction No.</th>
                    <th>Customer Name</th>
                    <th>Payment Type</th>
                    <th>Amount Paid</th>
                    <th>Mode of Payment</th>
                    <th>Reference No.</th>
                    <th>Payment Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $txn)
                    <tr>
                        <td>{{ $txn->order->transaction_number }}</td>
                        <td>{{ $txn->order->sender_name }}</td>
                        <td>{{ $txn->payment_type === 'down_payment' ? 'DP' : ucfirst($txn->payment_type) }}</td>
                        <td class="text-left">₱{{ number_format($txn->payment_amount, 2) }}</td>
                        <td>{{ ucfirst($txn->payment_method) }} ({{ $txn->mop_name }})</td>
                        <td>{{ $txn->reference_number }}</td>
                        <td>{{ \Carbon\Carbon::parse($txn->paid_at)->format('m/d/Y, g:i A') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </body>
</html>