<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderContainer;
use App\Models\OrderItem;
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

        $finalPrice = $item['price'] - $discount;

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
            'changed_by' => Auth::id(),
        ]);
    }


    public function saveOrderItem(array $data){

        return DB::transaction(function() use ($data){

            $subtotal = 0;

            foreach ($data['order_items'] as $item) {

                $computed = $this->computeItem($item);

                $subtotal += $computed['subtotal'];

                $order = OrderItem::create([
                    'item_name' => $item['item_name'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'final_price' => $computed['final_price'],
                    'subtotal' => $computed['subtotal'],
                ]);
            }

            if($order->order_status === 'draft'){
                $order->update([
                    'order_status' => 'awaiting_shipping_fee'
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


    public function storeShippingInfo(array $data, int $order_id){
        
        return DB::transaction(function() use ($data, $order_id){

            $container = OrderContainer::findOrFail($data['container_id']);

            $totalShippingFee = $data['raw_shipping_fee'] + $container->charge;

            $shipment = Shipment::create([
                'order_id' => $order_id,
                'courier' => "jnt",
                'container_id' => $data['container_id'],
                'total_shipping_fee' => $totalShippingFee,
                'tracking_number' => $data['tracking_number']
            ]);

            $order = Order::findOrFail($order_id);

            $order->update([
                'order_status' => 'awaiting_payment'
            ]);

            return $shipment;
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
