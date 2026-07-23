<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderContainer;
use App\Models\OrderItem;
use App\Models\OrderReference;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\Shipment;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService{

    public function saveCustomer(Order $order, array $data){
        
        return DB::transaction(function() use ($data, $order){

            // dd($data);

            
            //if the checkbox is frequent customer then save to customers table
            if(!empty($data['is_save_customer'])){ 
                Customer::firstOrCreate([
                    'sender_name' => $data['sender_name'],
                    'receiver_name' => $data['receiver_name'],
                    'contact_number' => $data['contact_number'],
                    'address' => $data['address']
                ]);
            }
            

            //then update the snapshot of the customer info in orders table 
            $order->update([
                'sender_name' => $data['sender_name'],
                'receiver_name' => $data['receiver_name'],
                'contact_number' => $data['contact_number'],
                'address' => $data['address']
            ]);

            return $order;
        });

    
    }

    protected function computeItem(array $item){

        $discount = $item['discount'] ?? 0;

        $finalPrice = $item['variant_price'] - $discount;

        $subtotal = $finalPrice * $item['qty'];

        return [
            'final_price' => $finalPrice,
            'subtotal' => $subtotal,
        ];
    }

    protected function storeStatusHistory(
        Order $order,
        ?string $oldStatus,
        string $newStatus
    ){

        $order->statusHistories()->create([
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            // 'changed_by' => Auth::id(),
            'changed_by' => 1,
        ]);
    }


    public function saveOrderItem(Order $order, array $data){

        return DB::transaction(function() use ($data, $order){

            $subtotal = 0;
            $totalDiscount = 0;


            //create or update orderReference data
            foreach($data['orderReferences'] as $ref){

                $orderReference = OrderReference::firstOrCreate([
                    'order_id' => $order->id,
                    'order_number' => $ref['order_number'],
                ]);

                foreach($ref['items'] as $item){

                    $computed = $this->computeItem($item);
                    $subtotal += $computed['subtotal'];
                    $totalDiscount += $item['discount'] ?? 0;

                    OrderItem::updateOrCreate(
                        [
                            'order_reference_id' => $orderReference->id,
                            'product_variant_id' => $item['selected_variant_id'],
                        ],
                        [
                            'order_id' => $order->id,
                            'qty' => $item['qty'],
                            'price' => $item['variant_price'],
                            'discount' => $item['discount'] ?? 0,
                            'final_price' => $computed['final_price'],
                            'subtotal' => $computed['subtotal'],
                        ]
                    );
                }
            }

            if($order->order_status === 'draft'){
                $order->update([
                    'order_status' => 'awaiting_shipping_fee'
                ]);
            }

            //subtotal is already computed with multiplied by qty in computeItem Function
            $totalAmount = $subtotal - $totalDiscount;
            
            // get the sum or total amount paid by the customer to get the right computation for remaining balance
            $totalPaid = Payment::where('order_id', $order->id)
                ->where('payment_type', 'item_payment')
                ->sum('payment_amount');

            //calculate the remaining balance and avoid negative number by default to 0
            $remainingBalance = max(0, $totalAmount - $totalPaid);

            $paymentStatus = "unpaid";

            if($remainingBalance <= 0 ){
                $paymentStatus = "paid";
            }else{
                if($totalPaid > 0){
                    $paymentStatus = "partial";
                }
            }

            // $paymentStatus = $remainingBalance <= 0 ? 'paid' : ($totalPaid > 0 ? 'partial' : 'unpaid');

            $order->update([
                'subtotal' => $subtotal,
                'discount' => $totalDiscount,
                'total_amount' => $totalAmount,
                'remaining_balance' => $remainingBalance,
                'payment_status' => $paymentStatus
            ]);

            $this->storeStatusHistory(
                $order,
                null,
                'awaiting_shipping_fee'
            );

            
            return $order->load('references', 'items');

        });

    }

    public function saveShippingInfo(Order $order, array $data)
    {
        return DB::transaction(function () use ($data, $order) {

            $totalShippingFee = $data['raw_shipping_fee'] + $data['container_fee'];

            //get the previous sf
            $previousShippingFee = Shipment::where('order_id', $order->id)
                ->value('total_shipping_fee') ?? 0;

            $shipment = Shipment::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'courier' => 'jnt',
                    'container_type' => $data['container_type'],
                    'container_size' => $data['container_size'],
                    'raw_shipping_fee' => $data['raw_shipping_fee'],
                    'container_fee' => $data['container_fee'],
                    'total_shipping_fee' => $totalShippingFee,
                    'tracking_number' => $data['tracking_number'],
                ]
            );

            $updatedShippingFee = $totalShippingFee - $previousShippingFee;

            

            $newRemainingBalance = max(0,$order->remaining_balance + $updatedShippingFee);

            $order->update([
                'order_status' => 'awaiting_payment',
                'remaining_balance' => $newRemainingBalance
            ]);

            return $shipment;
        });
    }

    // public function saveShippingInfo(Order $order, array $data){
        
    //     return DB::transaction(function() use ($data, $order){

    //         $totalShippingFee = $data['raw_shipping_fee'] + $data['container_fee'];
    //         $order_id = $order->id;

    //         $shipment = Shipment::where('order_id', $order_id)->first();
        
    //         if(!$shipment){

    //             $shipment = Shipment::create([
    //                 'order_id' => $order_id,
    //                 'courier' => "jnt",
    //                 'container_type' => $data['container_type'],
    //                 'container_size' => $data['container_size'],
    //                 'raw_shipping_fee' => $data['raw_shipping_fee'],
    //                 'container_fee' => $data['container_fee'],
    //                 'total_shipping_fee' => $totalShippingFee,
    //                 'tracking_number' => $data['tracking_number']
    //             ]);

    //         }else{

    //             $shipment->update([
    //                 'container_type' => $data['container_type'],
    //                 'container_size' => $data['container_size'],
    //                 'raw_shipping_fee' => $data['raw_shipping_fee'],
    //                 'container_fee' => $data['container_fee'],
    //                 'total_shipping_fee' => $totalShippingFee,
    //                 'tracking_number' => $data['tracking_number']
    //             ]);

    //         }

            
    //         $order = Order::findOrFail($order_id );

    //         $order->update([
    //             'order_status' => 'awaiting_payment'
    //         ]);

    //         return $shipment;
    //     });
    
    // }

    public function addPayment(array $data, int $order_id, int $user_id){

        return DB::transaction(function() use ($data, $order_id, $user_id){

            $order = Order::findOrFail($order_id);

            //avoid overpayment
            if ($data['payment_amount'] > $order->remaining_balance) {
                throw ValidationException::withMessages([
                    'payment_amount' => 'Payment exceeds the remaining balance.'
                ]);
            }

            $proof_imagePath = null;

            if(!empty($data['proof_image'])){

                $file = $data['proof_image'];

                $fileName = $order->transaction_number . '_'.time().'.'.$file->extension();

                $proof_imagePath = $file->storeAs(
                    'payments',
                    $fileName,
                    'public'
                );
            }

            $payment = Payment::create([
                'order_id' => $order_id,
                'payment_amount' => $data['payment_amount'],
                'payment_method' => $data['payment_method'],
                'payment_type' => $data['payment_type'],
                'mop_name' => $data['mop_name'],
                'reference_number' => $data['reference_number'],
                'encoded_by' => $user_id,
                'proof_image' => $proof_imagePath,
                'remarks' => $data['remarks'],
                'paid_at' => now()
            ]);

            // Calculate total customer payments only
            $totalPaid = Payment::where('order_id', $order_id)
                ->where('payment_type', 'item_payment')
                ->sum('payment_amount');
            
            
            $remaining_balance = $order->total_amount - $totalPaid;

            $oldStatus = $order->order_status;

            $orderStatus = $remaining_balance == 0 ? 'processing': 'payment';
            $paymentStatus = $remaining_balance <= 0 ? 'paid' : 'partial';
            

            $order->update([
                'remaining_balance' => $remaining_balance,
                'payment_status' => $paymentStatus,
                'order_status' => $orderStatus
            ]);

             if ($oldStatus !== $orderStatus) {
                OrderStatusHistory::create([
                    'order_id' => $order_id,
                    'old_status' => $oldStatus,
                    'new_status' => $orderStatus,
                    'changed_by' => $user_id,
                    'remarks' => 'Order fully paid.',
                ]);
            }

            return $payment;
        });

    }


    

    public function saveShipment(array $data, int $order_id){

        return DB::transaction(function() use ($data, $order_id){

            $shipment = Shipment::where('order_id', $order_id)->get();

            $shipment->update([
                'sf_payment_reference' => $data['sf_payment_reference'],
                'shipped_at' => now()
            ]);

            $order = Order::findOrFail($order_id);

            if($order){
                $order->update([
                    'order_status' => "shipped"
                ]);
            }

            return $shipment;
        });

    }


    



    


    


    

    // protected function storeOrderItem(Order $order, array $item){

    //     $computed = $this->computeItem($item);

    //     //store order items using eloquent 
    //     $order->items()->create([
    //         'item_name' => $item['item_name'] ?? null,
    //         'qty' => $item['qty'] ?? 1,
    //         'price' => $item['price'] ?? 0,
    //         'discount' => $item['discount'] ?? 0,
    //         'final_price' => $computed['final_price'],
    //         'subtotal' => $computed['subtotal']
    //     ]);

    // }

   

}
