<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //

    protected $fillable = [
        'order_id',
        'payment_amount',
        'payment_method',
        'payment_type',
        'mop_name',
        'reference_number',
        'encoded_by',
        'proof_image',
        'remarks',
        'paid_at'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function encoder()
    {
        return $this->belongsTo(User::class, 'encoded_by');
    }

}
