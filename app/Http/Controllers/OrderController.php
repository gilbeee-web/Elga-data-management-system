<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreOrderRequest;
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


    public function index(){

        return Inertia::render('Orders/Index');
    }

    public function create(){
        
        return Inertia::render('Orders/Create');
    }

    public function store(StoreOrderRequest $request){

       try{

        $this->orderService->store($request->validated());

        return redirect()->back()->with(['success' => 'order created']);

       }catch(Exception $e){
        return redirect()->back()->with(['error' => 'Something went wrong: ' . $e]);
       }

    }




}
