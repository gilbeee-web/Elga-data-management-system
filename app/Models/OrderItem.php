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
        'subtotal',
        'order_reference_id'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    
    public function product_variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function order_reference(){
        return $this->belongsTo(OrderReference::class);
    }

}
