<?php

namespace App\Services;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductService{

    public function store(array $data){

        return DB::transaction(function() use ($data){

            $imagePath = null;

            if(isset($data['image'])){

                $file = $data['image'];

                $fileName = $data['name'].'_'.time().'.'.$file->extension();

                $imagePath = $file->storeAs(
                    'products',
                    $fileName,
                    'public'
                );

            }

            $product = Product::create([
                'name' => $data['name'],
                'category' => $data['category'],
                'image' => $imagePath
            ]);

            foreach ($data['variants'] as $variant) {
                $product->variants()->create([
                    'variant_name' => $variant['variant_name'],
                    'price' => $variant['price'],
                    'product_code' => $variant['product_code'],
                    'sold' => 0
                ]);
            }

            return $product->load('variants');

        });
    }

    public function update(Product $product, array $data){

        return DB::transaction(function () use ($product, $data) {

            $imagePath = $product->image;

            if(isset($data['image'])){

                $file = $data['image'];
                
                //delete previous product image if updating
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                $fileName = $data['name'].'_'.time().'.'.$file->extension();

                $imagePath = $file->storeAs(
                    'products',
                    $fileName,
                    'public'
                );

            }

            $product->update([
                'name' => $data['name'],
                'category' => $data['category'],
                'image' => $imagePath
            ]);

            //collect the variant_id that are present
            $variantIds = [];

            

            foreach($data['variants'] as $variant){

                if(isset($variant['id'])){
                    $variantIds[] = $variant['id'];

                    $variantToUpdate =  $product->variants()->find($variant['id']);

                    if($variantToUpdate){
                        $variantToUpdate->update([
                            'variant_name' => $variant['variant_name'],
                            'product_code' => $variant['product_code'],
                            'price' => $variant['price'],                            
                        ]);
                    }

                }else{
                    // dd($variant);

                    $newVariant = $product->variants()->create([
                        'variant_name' => $variant['variant_name'],
                        'product_code' => $variant['product_code'],
                        'price' => $variant['price'],
                        'sold' => 0
                    ]);

                    $variantIds[] = $newVariant->id; //add the new variant id
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