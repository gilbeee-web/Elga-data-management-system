<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    //
    protected $fillable = [
        'item_name',
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
}
