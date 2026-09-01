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
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OrderService{

    protected $shopId;

    public function __construct()
    {   
        $this->shopId = session('shop_id');
    }

    //compute the subtotal of the item
    protected function computeItem(array $item){

        $discount = $item['discount'] ?? 0;

        $finalPrice = $item['variant_price'] - $discount;

        $subtotal = $finalPrice * $item['qty'];

        return [
            'final_price' => $finalPrice,
            'subtotal' => $subtotal,
        ];
    }

    protected function computeOrderSubtotal(array $item){

        $order_subtotal = $item['variant_price'] * $item['qty'];

        return $order_subtotal;
    }

    protected function recalculateOrderTotals(Order $order): Order
    {
        // Sum of item subtotals AFTER discount, freshly computed from
        // OrderItem rows (not carried over from a previous call).
        $itemsTotal = OrderItem::where('order_id', $order->id)->sum('subtotal');
 
        $shippingFee = Shipment::where('order_id', $order->id)
            ->value('total_shipping_fee') ?? 0;
 
        $grandTotal = $itemsTotal + $shippingFee;
 
        $totalPaid = Payment::where('order_id', $order->id)->sum('payment_amount');
 
        $remainingBalance = max(0, $grandTotal - $totalPaid);
 
        $paymentStatus = 'unpaid';
        if ($remainingBalance <= 0 && $grandTotal > 0) {
            $paymentStatus = 'paid';
        } elseif ($totalPaid > 0) {
            $paymentStatus = 'partial';
        }
 
        $order->update([
            'total_amount' => $grandTotal,
            'remaining_balance' => $remainingBalance,
            'payment_status' => $paymentStatus,
        ]);
 
        return $order->fresh();
    }

    

    protected function storeStatusHistory(
        Order $order,
        ?string $oldStatus,
        ?string $newStatus,
        ?string $remarks = null
    ){

        if($oldStatus === $newStatus){
            return;
        }

        $order->statusHistories()->create([
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => Auth::id(),
            'remarks' => $remarks,
        ]);
    }


    public function saveDraft(array $data){

        $lastOrder = Order::where('shop_id', $this->shopId)->latest('id')->first();

        if ($lastOrder) {
            $nextNumber = ((int) str_replace('TXN-', '', $lastOrder->transaction_number)) + 1;
        } else {
            $nextNumber = 1;
        }

        $transactionNumber = 'TXN-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        $order = Order::create([
            'shop_id' => $this->shopId,
            'transaction_number' => $transactionNumber,
            'order_type' => $data['order_type'],
            'subtotal' => 0,
            'discount' => 0,
            'total_amount' => 0,
            'payment_status' => "unpaid",
            'order_status' => "draft"
        ]);

        $this->storeStatusHistory(
            $order,
            null,
            'draft',
            'Order created.'
        );


        return $order;
    }

    public function saveCustomer(Order $order, array $data){
        
        return DB::transaction(function() use ($data, $order){
            
            //if the checkbox is frequent customer then save to customers table
            if(!empty($data['is_save_customer'])){ 
                Customer::firstOrCreate([
                    'shop_id' => $this->shopId,
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


    public function saveOrderItem(Order $order, array $data){

        return DB::transaction(function() use ($data, $order){

            // total of the item without discount (display only)
            $orderSubtotal = 0; 

            //total discount applied in all items (discount * qty)
            $totalDiscount = 0;


            //collects the IDs that involved in the update or creating process
            $touchedOrderItemIds = [];
            $touchedOrderReferenceId = [];


            //create or update orderReference data
            foreach($data['orderReferences'] as $ref){

                $orderReference = OrderReference::firstOrCreate([
                    'shop_id' => $this->shopId,
                    'order_id' => $order->id,
                    'order_number' => $ref['order_number'],
                ]);

                //track the order reference id in the payload
                $touchedOrderReferenceId[] = $orderReference->id;

                foreach($ref['items'] as $item){
                    
                    //get the computed value with discount
                    $computed = $this->computeItem($item); 

                    // compute the item by item price * qty
                    $orderSubtotal += $this->computeOrderSubtotal($item); 

                    // each item computed by discount
                    $totalDiscount += ($item['discount'] ?? 0) * $item['qty'];
                    
                    $orderItem = OrderItem::updateOrCreate(
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
                            'subtotal' => $computed['subtotal'], // subtotal of the item with discount
                        ]
                    );

                    $touchedOrderItemIds[] = $orderItem->id;
                }
            }



            // delete all the order item that is not in the payload that have the same order id
            OrderItem::where('order_id', $order->id)
                ->whereNotIn('id', $touchedOrderItemIds)
                ->delete(); 
            
            // delete all the order references that is no longer in the payload
            OrderReference::where('order_id', $order->id)
                ->whereNotIn('id', $touchedOrderReferenceId)
                ->delete();


            //only change the status of the order if it actually changes
            $oldStatus = $order->order_status;
            if ($oldStatus === 'draft') {

                if ($order->order_type === 'walkin') {
                    $newStatus = 'awaiting_payment';
                } else {
                    $newStatus = 'awaiting_shipping_fee';
                }

                $order->update([
                    'order_status' => $newStatus
                ]);

                $this->storeStatusHistory($order, $oldStatus, $newStatus, "Customer and order item encoded.");
            }


            //save the data that is for display
            $order->update([
                'subtotal' => $orderSubtotal,
                'discount' => $totalDiscount,
            ]);
            

            // always calculate the total value based on the fresh or updated data 
            $this->recalculateOrderTotals($order);

            return $order->fresh()->load('references', 'items');

        });

    }

    public function saveShippingInfo(Order $order, array $data)
    {
        return DB::transaction(function () use ($data, $order) {

            // total sf with container fee
            $totalShippingFee = $data['raw_shipping_fee'] + $data['container_fee'];

            Shipment::updateOrCreate(
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

            $oldStatus = $order->order_status;
            $newStatus = $oldStatus === 'awaiting_shipping_fee'
                ? 'awaiting_payment'
                : $oldStatus;

            //only update the order status if it not equal to previous status
            if ($newStatus !== $oldStatus) {
                $order->update(['order_status' => $newStatus]);
                $this->storeStatusHistory($order, $oldStatus, $newStatus, "Shipping fee encoded.");
            }

            // recompute the total based on the fresh or updated data
            $this->recalculateOrderTotals($order);

            return $order->fresh()->load('shipment');
        });
    }


    public function savePayment(Order $order, array $data, ?int $paymentId = null){

        return DB::transaction(function() use ($data, $order, $paymentId){

            $existingAmount = 0;
            $existingPayment = null;
            
            //if editing get the existing payment amount
            if($paymentId){
                $existingPayment = Payment::where('id', $paymentId)
                    ->where('order_id', $order->id)
                    ->first();

                $existingAmount = $existingPayment->payment_amount ?? 0;
            }

            // if existing amount is not 0 it "give back" to original balance that replaced the previous payment
            // add again the existing amount that subtract in the previous payment (edit mode)
            $availableBalance = $order->remaining_balance + $existingAmount;

            // dd($availableBalance);

            //avoid overpayment
            if ($data['payment_amount'] > $availableBalance) {
                throw ValidationException::withMessages([
                    'payment_amount' => 'Payment exceeds the remaining balance.'
                ]);
            }

            $proof_imagePath = null;
            $shouldDeleteOldImage = false;

            if(!empty($data['proof_image'])){

                $file = $data['proof_image'];

                $fileName = $order->transaction_number . '_'.time().'.'.$file->extension();

                $proof_imagePath = $file->storeAs(
                    'payments',
                    $fileName,
                    'public'
                );

                $shouldDeleteOldImage = true;
            }

            // Delete the old file from storage if it's being replaced or removed
            if ($shouldDeleteOldImage && $existingPayment && $existingPayment->proof_image) {
                Storage::disk('public')->delete($existingPayment->proof_image);
            }

            $isFullPayment = bccomp((string) $data['payment_amount'], (string) $availableBalance, 2) === 0;
            $hasPriorPayments = Payment::where('order_id', $order->id)
                ->when($paymentId, fn ($q) => $q->where('id', '!=', $paymentId))
                ->exists();

            $paymentType = !$isFullPayment
                ? 'down_payment'
                : ($hasPriorPayments ? 'balance' : 'full');


            $payload = [
                'order_id' => $order->id,
                'payment_amount' => $data['payment_amount'],
                'payment_type' => $paymentType,
                'payment_method' => $data['payment_method'],
                'mop_name' => $data['mop_name'] ?? null,
                'reference_number' => $data['reference_number'] ?? null,
                'encoded_by' => Auth::id(),
                'remarks' => $data['remarks'] ?? null,
                'paid_at' => now(),
            ];

            // Only overwrite proof_image if a new one was uploaded
            if ($proof_imagePath) {
                $payload['proof_image'] = $proof_imagePath;
            }

            $payment = Payment::updateOrCreate(
                [
                    'id' => $paymentId,
                    'order_id' => $order->id
                ],
                $payload
            );

            $oldStatus = $order->order_status;

            $updatedOrder = $this->recalculateOrderTotals($order);

            $newStatus = $updatedOrder->remaining_balance == 0 ? 'processing' : 'payment_confirmed';
 
            if ($newStatus !== $oldStatus) {
                $order->update(['order_status' => $newStatus]);
                $this->storeStatusHistory($order, $oldStatus, $newStatus, 'Order fully paid.');
            }

            return $payment;
        });

    }

    public function destroyPayment(Order $order, int $paymentId)
    {
        return DB::transaction(function () use ($order, $paymentId) {
 
            $payment = Payment::where('id', $paymentId)
                ->where('order_id', $order->id)
                ->firstOrFail();
 
            $payment->delete();
 
            $oldStatus = $order->order_status;
 
            $updatedOrder = $this->recalculateOrderTotals($order);
 
            // not allowed to update the status to draft or awaiting sf or payment because the payment is just removed but the status is now in payment terms
            $newStatus = $oldStatus;
            if (in_array($oldStatus, ['processing', 'payment_confirmed'])) {

                if($updatedOrder->remaining_balance === $updatedOrder->total_amount){
                    $newStatus = "awaiting_payment";
                }else if($updatedOrder->remaining_balance === 0){
                    $newStatus = "processing";
                }else{
                    $newStatus = "payment_confirmed";
                }

                // $newStatus = $updatedOrder->remaining_balance == 0
                //     ? 'processing'
                //     : 'payment_confirmed';
            }

            //only update the order status if it actually changes
            if ($newStatus !== $oldStatus) {
                $order->update(['order_status' => $newStatus]);
                $this->storeStatusHistory($order, $oldStatus, $newStatus, 'Payment deleted.');
            }
 
            return $updatedOrder;
        });
    }


    

    public function saveShipment(Order $order, array $data)
    {
        return DB::transaction(function () use ($data, $order) {

            if ($order->order_type === 'shipment' && $order->status !== 'shipped') {

                $shipment = Shipment::where('order_id', $order->id)
                    ->firstOrFail();

                $shipment->update([
                    'sf_payment_reference' => $data['sf_payment_reference'] ?? null,
                    'shipped_at' => now(),
                    'remarks' => $data['remarks'] ?? null
                ]);


                $orderItems = OrderItem::with("product_variant")->where("order_id", $order->id)->get();

                // dd($orderItems);
                //increment the sold of the order item
                foreach($orderItems as $item){
                    $item->product_variant->increment('sold', $item->qty);
                }


                $oldStatus = $order->order_status;

                $order->update([
                    'completed_at' => now(),
                    'order_status' => 'shipped',
                ]);

                $this->storeStatusHistory(
                    $order,
                    $oldStatus,
                    'shipped'
                );

                return $shipment;
            }

            return null;
        });
    }

    public function completeOrder(Order $order)
    {   
        return DB::transaction(function () use ($order) {

            $orderItems = OrderItem::with("product_variant")->where("order_id", $order->id)->get();

            //increment the sold of the order item
            foreach($orderItems as $item){
                $item->product_variant->increment('sold', $item->qty);
                // $item->product_variant->decrement('stock', $item->qty); if mag-add ako ng stocks or inventory management
            }

            $oldStatus = $order->order_status;

            $order->update([
                'order_status' => 'shipped',
                'completed_at' => now(),
            ]);

            $this->storeStatusHistory(
                $order,
                $oldStatus,
                'shipped'
            );

            return $order;
        });
    }


    public function cancelOrder(Order $order)
    {
        if ($order->order_status === 'cancelled') {
            throw ValidationException::withMessages([
                'error' => 'This order is already cancelled.'
            ]);
        }

        if ($order->order_status === 'shipped') {
            throw ValidationException::withMessages([
                'error' => 'Shipped orders cannot be cancelled directly.'
            ]);
        }

        $order->update([
            'order_status' => 'cancelled',
        ]);

        return $order;
    }

    

}
