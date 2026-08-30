<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReference extends Model
{
    //
    protected $fillable = [
        'shop_id',
        'order_id',
        'order_number'
    ];

    public function shop(){
        $this->belongsTo(Shop::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function order_items(){
        return $this->hasMany(OrderItem::class);
    }

}
