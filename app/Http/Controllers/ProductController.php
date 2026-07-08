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

        $products = $query
            ->with('variants')
            ->withMin('variants', 'price')
            ->withMax('variants', 'price')
            ->withSum('variants', 'sold')
            ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);

    }

    public function create(){
        return Inertia::render('Products/CreateProduct');
    }



    public function view($id){
        
        $product = Product::findOrFail($id);

        if(!$product){
            return back()->with('error', "Product not found");
        }


        $product->load('variants');

        // $product = Product::with('variants')->where('id', $id);

        return response()->json(['product' => $product]);
    }

    public function edit($id){
        
        $product = Product::findOrFail($id);

        if(!$product){
            return back()->with('error', "Product not found");
        }

        $product->load('variants');

        return Inertia::render('Products/EditProduct', [
            'product' => $product
        ]);
    }


    
    public function store(Request $request){

        // dd($request->all());

        $validated_products = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'variants' => 'required|array',
            'variants.*.variant_name' => 'required|string',
            'variants.*.product_code' => 'required|string|distinct',
            'variants.*.price' => 'required|numeric|min:0',
        ]);
        
        // dd($validated_products);

        
        $this->productService->store($validated_products);
        

        return redirect()->route('product.index')->with('success', $validated_products['name'] . ' successfully added!');

    }


    public function update(Request $request, Product $product){

        // dd($request->all());

        $validated_product = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'variants' => 'required|array',
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.variant_name' => 'required|string',
            'variants.*.product_code' => 'required|string|distinct',
            'variants.*.price' => 'required|numeric|min:0',
        ]);

        // dd($validated_product);
        
        $this->productService->update($product, $validated_product);

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
