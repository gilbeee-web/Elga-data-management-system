<?php

namespace App\Services;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService{

    public function store(array $data){

        return DB::transaction(function() use ($data){

            $product = Product::create([
                'name' => $data['name'],
                'category' => $data['category']
            ]);


            foreach ($data['product_variants'] as $variant) {
                $product->variants()->create([
                    'variant_name' => $variant['variant_name'],
                    'price' => $variant['price'],
                    'sold' => 0
                ]);
            }

            return $product->load('variants');

        });
    }

    public function update(Product $product, array $data){

        return DB::transaction(function () use ($product, $data) {

            $product->update([
                'name' => $data['name'],
                'category' => $data['category']
            ]);

            //collect the variant_id that are present
            $variantIds = [];

            foreach($data['product_variants'] as $variant){

                if(isset($variant['id'])){
                    $variantIds[] = $variant['id'];

                    $variantToUpdate =  $product->variants()->find($variant['id']);

                    if($variantToUpdate){
                        $variantToUpdate->update([
                            'variant_name' => $variant['variant_name'],
                            'price' => $variant['price']
                        ]);
                    }

                }else{
                    $product->variants()->create([
                        'variant_name' => $variant['variant_name'],
                        'price' => $variant['price'],
                        'sold' => 0
                    ]);
                }

            }

            // Delete variants removed from the form or the variant_id that is NOT present anymore
            $product->variants()
                    ->whereNotIn('id', $variantIds)
                    ->delete();

            return $product->load('variants');
        });

    }


    public function destroyProduct(Product $product){

        $hasSoldVariant = $product->variants()->where('sold', '>', 0)->exists();

        if ($hasSoldVariant) {
            return false;
        }

        return DB::transaction(function () use ($product) {
            
            $product->variants()->delete();

            $product->delete();

            return true;
        });
        
    }

    public function disableProduct(Product $product){
        
        $product->update([
            'is_active' => false
        ]);

        return true;
    }








}