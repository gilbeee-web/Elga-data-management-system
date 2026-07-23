<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    //
    protected $fillable = ['product_id', 'variant_name', 'product_code', 'price', 'stock', 'sold'];


    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

}
