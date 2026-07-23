<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReference extends Model
{
    //
    protected $fillable = [
        'order_id',
        'order_number'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function order_items(){
        return $this->hasMany(OrderItem::class);
    }

}
