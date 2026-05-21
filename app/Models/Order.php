<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'customer_name',
        'subtotal',
        'raw_shipping_fee',
        'order_container_id',
        'container_fee',
        'total_shipping_fee',
        'discount',
        'total_amount',
        'payment_status',
        'order_status',
        'remaining_balance',
        'remarks'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function references()
    {
        return $this->hasMany(OrderReference::class);
    }

    public function container()
    {
        return $this->belongsTo(OrderContainer::class);
    }


}
