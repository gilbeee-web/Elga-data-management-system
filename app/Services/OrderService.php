<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderService{

    public function storeDraft(array $data)
    {
        return DB::transaction(function () use ($data) {

            $order = Order::create([
                'customer_name' => $data['customer_name'] ?? null,
                'created_by' => Auth::id(),
                'order_status' => 'draft',
            ]);

            if (!empty($data['order_items'])) {

                foreach ($data['order_items'] as $item) {

                    $this->storeOrderItem($order, $item);
                }
            }

            return $order;
        });
    }



    public function store(array $data){

        return DB::transaction(function() use ($data){

            $subtotal = 0;

            $order = Order::create([
                'customer_name' => $data['customer_name'] ?? null,
                'created_by' => Auth::id(),
                'order_status' => "awaiting_shipping_fee"
            ]);

            $order->update([
                'transaction_number' => 'TXN-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
            ]);

            foreach ($data['order_items'] as $item) {

                $computed = $this->computeItem($item);

                $subtotal += $computed['subtotal'];

                $order->items()->create([
                    'item_name' => $item['item_name'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'final_price' => $computed['final_price'],
                    'subtotal' => $computed['subtotal'],
                ]);
            }

            $order->update([
                'subtotal' => $subtotal,
                'remaining_balance' => $subtotal,
            ]);

            $this->storeStatusHistory(
                $order,
                null,
                'awaiting_shipping_fee'
            );


            return $order;
        });

    }

    protected function computeItem(array $item){

        $discount = $item['discount'] ?? 0;

        $finalPrice = $item['price'] - $discount;

        $subtotal = $finalPrice * $item['qty'];

        return [
            'final_price' => $finalPrice,
            'subtotal' => $subtotal,
        ];
    }


    protected function storeOrderItem(Order $order, array $item){

        $computed = $this->computeItem($item);

        //store order items using eloquent 
        $order->items()->create([
            'item_name' => $item['item_name'] ?? null,
            'qty' => $item['qty'] ?? 1,
            'price' => $item['price'] ?? 0,
            'discount' => $item['discount'] ?? 0,
            'final_price' => $computed['final_price'],
            'subtotal' => $computed['subtotal']
        ]);

    }

    protected function storeStatusHistory(
        Order $order,
        ?string $oldStatus,
        string $newStatus
    ){

        $order->statusHistories()->create([
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => Auth::id(),
        ]);
    }

}
