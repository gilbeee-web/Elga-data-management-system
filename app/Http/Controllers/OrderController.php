<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\Shipment;
use App\Models\Shop;
use App\Services\OrderService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
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


    public function index(Request $request)
    {
        $query = Order::with('references');

        if ($request->filled('filter_status') && $request->filter_status !== 'all') {

            if($request->filter_status === "awaiting_payment" || $request->filter_status === "payment_confirmed"){
                $query->whereIn('order_status', [
                    'awaiting_payment',
                    'payment_confirmed',
                ]);
            }else{
                $query->where('order_status', $request->filter_status);
            }                
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('receiver_name', 'like', '%' . $search . '%')
                    ->orWhere('sender_name', 'like', '%' . $search . '%')
                    ->orWhere('transaction_number', 'like', '%' . $search . '%')
                    ->orWhereHas('references', function ($q2) use ($search) {
                        $q2->where('order_number', 'like', '%' . $search . '%');
                    });
            });
        }

        $orders = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['filter_status', 'search']),
            'user' => Auth::user(),
            'shops' => Shop::all()
        ]);
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
                'id' => $ref->id,
                'order_number' => $ref->order_number,
                'items' => $items
            ];

        }

        $shipmentInfo = Shipment::where('order_id', $order->id)->first();

        $totalPaid = Payment::where('order_id', $order->id)->sum('payment_amount');
    
        $payments = Payment::where('order_id', $order->id)->get();

        return Inertia::render('Orders/Edit', [
            'order' => $order->fresh(), 
            'order_type' => $order->order_type,
            'customer' => $customer,
            'orderReferences' => $orderReferences,
            'shipmentInfo' => $shipmentInfo,
            'payments' => $payments,
            'orderSummary' => [
                'sender_name' => $order->sender_name,
                'receiver_name' => $order->receiver_name,
                'subtotal' => $order->subtotal,
                'shipping_fee' => $order->shipment?->total_shipping_fee,
                'discount' => $order->discount,
                'total_paid' => $totalPaid,
                'total_amount' => $order->total_amount,
                'remaining_balance' => $order->remaining_balance
            ],
            'user' => Auth::user()
        ]);
    }

    public function saveDraft(Request $request){

        $order = Order::create([
            'order_type' => $request->order_type,
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
            'contact_number' => [
                Rule::requiredIf($order->order_type !== 'walkin'),
                'nullable',
                'string',
                'max:11',
            ],
            'address' => [
                Rule::requiredIf($order->order_type !== 'walkin'),
                'nullable',
                'string',
            ],
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

        $shipment = Shipment::where('order_id', $order->id)->first();

        $validated = $request->validate([
            'order_id' => 'nullable|integer|exists:orders,id',
            'container_type' => 'required|string',
            'container_size' => 'required|string',
            'raw_shipping_fee' => 'required|numeric',
            'container_fee' => 'required|numeric',
            'tracking_number' => [
                'required',
                'string',
                Rule::unique('shipments', 'tracking_number')
                    ->ignore($shipment?->id),
            ],
        ],[
            'tracking_number.unique' => 'This tracking number already exists.'
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
            'payment_id' => 'nullable|numeric|exists:payments,id',

            'payment_method' => 'required|string',

            'payment_amount' => 'required|numeric',

            'mop_name' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    !in_array($request->payment_method, ['cash', 'card_payment'])
                ),
            ],

            'reference_number' => [
                'nullable',
                'string',

                Rule::requiredIf(
                    !in_array($request->payment_method, ['cash', 'card_payment'])
                ),

                Rule::unique('payments', 'reference_number')
                    ->ignore($request->payment_id),
            ],

            'proof_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'remarks' => 'nullable|string',
        ], [
            'reference_number.unique' =>
                'This reference number already exists.',

            'mop_name.required' =>
                'MOP name is required for this payment method.',

            'reference_number.required' =>
                'Reference number is required for this payment method.',
        ]);

        // dd($validated);


        try {
            $this->orderService->savePayment(
                $order, 
                $validated, 
                $validated['payment_id'] ?? null
            );
        } catch (ValidationException $e) {
            dd($e); // let Laravel/Inertia handle it as a validation error
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Error in adding payment.');
        }

        return redirect()->back()->with('success', 'Payment added successfully!');
    }


    public function destroyPayment(Order $order, $payment_id){

        try{
            $this->orderService->destroyPayment($order,$payment_id);
        }catch(Exception $e){
            return redirect()->back()->with(['error', 'Error in destroying payment.']);
        }
        
        
        return redirect()->back()->with('success', "Successfully removed the payment.");
    }


    //shipped the order for shipment order
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

        return redirect()->route('order.index');
        
    }

    //complete order for walkin orders
    public function completeOrder(Order $order){
        
        try{
            $this->orderService->completeOrder($order);
        }catch(Exception $e){
            dd("Something went wrong: ", $e);
            return redirect()->back()->with(['error', 'Error in mark as shipped the order.']);
        }

        return redirect()->route('order.index');
    }


    public function destroyOrder(Order $order)
    {
        if ($order->payments()->exists()) {
            return back()->with('error', 'Cannot delete an order with existing payments. This record must be kept for financial history.');
        }

        if (!in_array($order->order_status, ['draft', 'cancelled'])) {
            return back()->with('error', 'Only draft or cancelled orders can be deleted.');
        }

        $order->delete();
        return redirect()->route('order.index')->with('success', 'Order deleted.');
    }

    public function cancelOrder(Order $order){
        try{
            $this->orderService->cancelOrder($order);
        }catch(Exception $e){
            return redirect()->back()->with('error', 'Error in cancelling the order.');
        }
        
        return redirect()->route('order.index')->with('success', 'Order cancelled.');
    }


    public function getVariantOrderHistory(ProductVariant $variant){
        
        // dd($variant);

        $orderHistory = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.product_variant_id', $variant->id)
            ->select(
                'order_items.id as order_item_id',
                'order_items.product_variant_id',
                'order_items.qty as item_qty',
                'order_items.price as item_price',
                'orders.transaction_number',
                'orders.receiver_name',
                'orders.sender_name',
                'orders.completed_at'
            )
            ->orderByDesc('order_items.created_at')
            ->get();

        return response()->json($orderHistory);
    }

    public function switchOrderType(Order $order, Request $request){

        $validated = $request->validate([
            'order_type' => ['required', 'string', 'in:shipment,walkin'],
        ]);

        $order->update([
            'order_type' => $validated['order_type'],
        ]);

        return redirect()->back()->with(
            'success',
            'Switched to ' . $order->order_type
        );
    }









}
