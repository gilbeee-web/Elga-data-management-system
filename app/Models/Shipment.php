<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    //
    protected $fillable = [
        'order_id',
        'courier',
        'order_container_id',
        'raw_shipping_fee',
        'container_fee',
        'total_shipping_fee',
        'tracking_number',
        'sf_payment_reference',
        'shipped_at'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
