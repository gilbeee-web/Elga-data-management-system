<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'transaction_number',
        'order_type',
        'sender_name',
        'receiver_name',
        'contact_number',
        'address',
        'subtotal',
        'discount',
        'total_amount',
        'payment_status',
        'order_status',
        'remaining_balance',
        'remarks',
        'completed_at'
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


    public function customer(){
        return $this->belongsTo(Customer::class);
    }


}
