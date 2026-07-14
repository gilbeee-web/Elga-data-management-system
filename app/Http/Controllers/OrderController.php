<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Services\OrderService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        
        return Inertia::render('Orders/Edit', [
            'order' => $order, 
            'customer' => $customer
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



    public function storeOrderItem(StoreOrderRequest $request){

       try{

        $this->orderService->saveOrderItem($request->validated());

        return redirect()->back()->with(['success' => 'order created']);

       }catch(Exception $e){

        return redirect()->back()->with(['error' => 'Something went wrong: ' . $e]);

       }

    }













}
