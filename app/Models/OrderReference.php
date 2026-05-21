<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReference extends Model
{
    //
    protected $fillable = [
        'order_id',
        'order_reference'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
