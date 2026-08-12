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
        @php
            $paymentTypeLabels = [
                'full' => 'Full Payment',
                'downpayment' => 'Down Payment',
                'balance' => 'Balance Payment',
                'partial' => 'Partial Payment',
            ];
        @endphp

        @foreach($transactions as $txn)
            <tr>
                <td>{{ $txn->order->transaction_number }}</td>
                <td>{{ $txn->order->sender_name }}</td>
                <td>{{ $paymentTypeLabels[$txn->payment_type] ?? ucfirst($txn->payment_type) }}</td>
                <td>{{ $txn->payment_amount }}</td>
                <td>{{ ucfirst($txn->payment_method) }} ({{ $txn->mop_name }})</td>
                <td>{{ $txn->reference_number }}</td>
                <td>{{ \Carbon\Carbon::parse($txn->paid_at)->format('m/d/Y, g:i A') }}</td>
            </tr>
        @endforeach
    </tbody>
</table>