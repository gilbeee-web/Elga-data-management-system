<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderContainer extends Model
{
    //
    protected $fillable = [
        'type',
        'size',
        'charge'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
