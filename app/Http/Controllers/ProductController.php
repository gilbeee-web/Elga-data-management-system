<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    //

    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }


    public function index(Request $request){

        $query = Product::query()->where('is_active', true);

        if($request->category){
            $query->where('category', $request->category);
        }

        if($request->search){
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->with('variants')->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);

    }
    
    public function store(Request $request){

        $validated_products = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'product_variants' => 'required|array',
            'product_variants.*.variant_name' => 'required|string',
            'product_variants.*.price' => 'required|numeric|min:0',
        ]);

        
        $this->productService->store($validated_products);
        

        return redirect()->route('product.index')->with('success', $validated_products['name'] . ' successfully added!');

    }


    public function update(Request $request, Product $product){

        $validated_products = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'product_variants' => 'required|array',
            'product_variants.*.variant_name' => 'required|string',
            'product_variants.*.price' => 'required|numeric|min:0',
        ]);
        
        $this->productService->update($product, $validated_products);

        return redirect()->route('product.index')->with('success', $product->name . ' successfully updated!');
    }

    public function destroy(Product $product){

        $deleted = $this->productService->destroyProduct($product);

        if(!$deleted){
            return back()->with(
                'error',
                'You cannot delete a product because one or more variants have already been sold.'
            );
        }

        return redirect()->route('product.index')->with('success', $product->name . ' successfully deleted!');

    }


    public function disableProduct(Product $product){

        $this->productService->disableProduct($product);

        return redirect()->route('product.index')->with('success', $product->name . ' successfully disabled!');
    }


}
