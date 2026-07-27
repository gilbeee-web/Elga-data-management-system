<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Shipment;
use App\Services\OrderService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;


class OrderController extends Controller
{
    //

    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }


    public function index(Request $request){

        $query = Order::query();

        if($request->filter_status){
            $query->where('order_status', $request->filter_status);
        }

        $orders = $query->with('references')->get();


        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function edit(Order $order){
        
        //get the current customer data of the order to pass in the component
        $customer = $order->only([
            'sender_name',
            'receiver_name',
            'contact_number',
            'address',
        ]);

        $order->load([
            'references',
            'items.product_variant.product',
        ]);

        $orderReferences = [];

        foreach($order->references as $ref){

            $items = [];

            foreach($order->items as $item){

                //skip if the order item if doesnt belong to the current reference
                if ($item->order_reference_id !== $ref->id) {
                    continue;
                }

                $variant = $item->product_variant;
                $product = $variant->product;

                $items[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'image' => $product->image,
                    'variants' => $product->variants,
                    'selected_variant_id' => $variant->id,
                    'variant_name' => $variant->variant_name,
                    'variant_price' => $item->price,
                    'qty' => $item->qty,
                    'discount' => $item->discount,
                ];


            }

            $orderReferences[] = [
                'order_number' => $ref->order_number,
                'items' => $items
            ];

        }

        $shipmentInfo = Shipment::where('order_id', $order->id)->first();

        $totalPaid = Payment::where('order_id', $order->id)->sum('payment_amount');
    
        $payments = Payment::where('order_id', $order->id)->get();

        return Inertia::render('Orders/Edit', [
            'order' => $order, 
            'customer' => $customer,
            'orderReferences' => $orderReferences,
            'shipmentInfo' => $shipmentInfo,
            'payments' => $payments,
            'orderSummary' => [
                'receiver_name' => $order->receiver_name,
                'subtotal' => $order->subtotal,
                'shipping_fee' => $order->shipment?->total_shipping_fee,
                'discount' => $order->discount,
                'total_paid' => $totalPaid,
                'total_amount' => $order->total_amount,
                'remaining_balance' => $order->remaining_balance
            ]
        ]);
    }

    public function saveDraft(){

        $order = Order::create([
            'subtotal' => 0,
            'discount' => 0,
            'total_amount' => 0,
            'payment_status' => "unpaid",
            'order_status' => "draft"
        ]);

        $order->update([
            'transaction_number' => 'TXN-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
        ]);

        return redirect()->route('order.edit', $order);
    }


    public function saveCustomer(Order $order, Request $request){

        // dd($request->all());

        $validated = $request->validate([
            'customer_id' => 'nullable|integer|exists:customers,id',
            'sender_name' => 'required|string',
            'receiver_name' => 'required|string',
            'contact_number' => 'required|max:11',
            'address' => 'required|string',
            'is_save_customer' => 'nullable|boolean'
        ]);

        try{
            
            $this->orderService->saveCustomer($order,$validated);

            return redirect()->back()->with(['status' => 'draft']);

        }catch(Exception $e){
            return redirect()->back()->with(['error' => 'Something went wrong: ' . $e]);
        }

    }


    public function getSaveCustomers(){

        $saveCustomers = Customer::get(); 
       

        return response()->json($saveCustomers);
    }



    public function saveOrderItem(Order $order, StoreOrderRequest $request){

        // dd($request->all());

        try{

            $this->orderService->saveOrderItem($order,$request->validated());

            return redirect()->back()->with(['success' => 'order created']);

        }catch(Exception $e){
            dd($e);
            return redirect()->back()->with(['error' => 'Something went wrong: ' . $e]);

        }

    }


    public function saveShippingInfo(Order $order, Request $request){

        // dd($request->all());

        $validated = $request->validate([
            'order_id' => 'nullable|integer|exists:orders,id',
            'container_type' => 'string|required',
            'container_size' => 'string|required',
            'raw_shipping_fee' => 'numeric|required',
            'container_fee' => 'numeric|required',
            'tracking_number' => 'string|required'
        ]);

        try{
            $this->orderService->saveShippingInfo($order,$validated);
        }catch(Exception $e){
            dd($e);
            return redirect()->back()->with(['error' => 'Something went wrong: ' . $e]);
        }

        return redirect()->back()->with(['success' => "Shipping info saved successfully!"]);

    }


    public function savePayment(Order $order, Request $request){


        // dd($request->all());

        $validated = $request->validate([
            'payment_type' => 'string|required',
            'payment_method' => 'string|required',
            'payment_amount' => 'numeric|required',
            'mop_name' => 'string|required',
            'reference_number' => 'string|required',
            'proof_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'remarks' => 'nullable|string'
        ]);

        try{
            $this->orderService->savePayment($order, $validated);
        }catch(Exception $e){
            return redirect()->back()->with(['error', 'Error in adding payment.']);
        }


        return redirect()->back()->with(['success', 'Payment added successfully!']);
    }


    public function destroyPayment(Order $order, $payment_id){

        try{
            $this->orderService->deletePayment($order,$payment_id);
        }catch(Exception $e){
            dd("Something went wrong: ", $e);
            return redirect()->back()->with(['error', 'Error in destroying payment.']);
        }
        
        
        return redirect()->back()->with('success', "Successfully removed the payment.");
    }


    public function shippedOrder(Order $order, Request $request){

        $validated = $request->validate([
            'sf_payment_reference' => 'string|nullable'
        ]);

        try{
            $this->orderService->saveShipment($order,$validated);
        }catch(Exception $e){
            dd("Something went wrong: ", $e);
            return redirect()->back()->with(['error', 'Error in mark as shipped the order.']);
        }
        
    }










}
