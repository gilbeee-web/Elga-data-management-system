<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //

    protected $fillable = ['sender_name', 'receiver_name','contact_number','address'];

    public function order(){
        return $this->belongsTo(Order::class);
    }

}
