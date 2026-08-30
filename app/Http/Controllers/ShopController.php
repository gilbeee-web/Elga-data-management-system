<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ShopController extends Controller
{
    //
    public function store(Request $request){

        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'cover_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);


        if ($request->hasFile('cover_photo')) {
            $validated['cover_photo'] = $request->file('cover_photo')->store('shop_cover_photos', 'public');
        }

        $shop = Shop::create($validated);

        return redirect()->back()->with([
            'message' => 'Shop created successfully',
            'shop' => $shop
        ]);

    }

    public function getShops(){

        $shops = Shop::all();

        return response()->json($shops);
    }



    public function edit(Shop $shop){
        return response()->json($shop);
    }

    public function update(Shop $shop, Request $request){

        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'cover_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($request->hasFile('cover_photo')) {

            // delete the old file before storing the new one
            if ($shop->cover_photo && Storage::disk('public')->exists($shop->cover_photo)) {
                Storage::disk('public')->delete($shop->cover_photo);
            }

            $validated['cover_photo'] = $request->file('cover_photo')->store('shop_cover_photos', 'public');
        }


        $shop->update($validated);

        return redirect()->back()->with([
            'message' => 'Shop information updated successfully!',
            'shop' => $shop
        ]);
    }

    public function switchShop(Shop $shop){

        session()->put('shop_id', $shop->id);

        return back();

    }


    public function destroy(Shop $shop){

        $hasProducts = Product::where('shop_id', $shop->id)->get();
        $hasOrders = Order::where('shop_id', $shop->id)->get();

        if($hasProducts || $hasOrders){
            throw ValidationException::withMessages([
                'error' => 'Cannot delete this shop.',
            ]);
        }


        return redirect()->route('shop.index')->with([
            'message' => 'Shop information deleted successfully!',
            'shop' => $shop
        ]);
    }





}
