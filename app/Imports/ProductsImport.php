<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProductsImport implements ToCollection
{

    public function collection(Collection $rows)
    {
        
        DB::transaction(function () use ($rows){

            foreach($rows->skip(1) as $row){

                $productName = trim($row[0]);
                $variantName = trim($row[1]);
                $productCode = trim($row[2]);
                $variantPrice = $row[3];
                $productCategory = trim($row[4]);

                // Find or create the product
                $product = Product::firstOrCreate(
                    [
                        'name' => $productName,
                    ],
                    [
                        'shop_id' => session('shop_id'),
                        'category' => $productCategory,
                        'is_active' => true,
                    ]
                );

                $product->variants()->updateOrCreate(
                    [
                        'product_code' => $productCode,
                    ],
                    [
                        'variant_name' => $variantName,
                        'product_code' => $productCode,
                        'price' => $variantPrice,
                        'sold' => 0,
                    ]
                );
            }

        });


    }
}
