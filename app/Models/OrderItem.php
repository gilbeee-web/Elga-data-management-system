<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    //
    protected $fillable = [
        'order_id',
        'product_variant_id',
        'qty',
        'price',
        'discount',
        'final_price',
        'subtotal'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product_variants(){
        return $this->hasMany(ProductVariant::class);
    }
}
