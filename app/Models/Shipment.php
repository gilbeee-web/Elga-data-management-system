<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    //
    protected $fillable = [
        'order_id',
        'courier',
        'shipping_fee',
        'tracking_number',
        'sf_payment_reference',
        'shipped_at'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
