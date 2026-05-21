<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    //
    protected $fillable = [
        'order_id',
        'new_status',
        'old_status',
        'changed_by',
        'remarks'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
