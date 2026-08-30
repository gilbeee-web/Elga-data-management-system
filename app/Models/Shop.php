<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    //
    protected $fillable = ['name', 'location', 'cover_photo', 'is_active'];

    public function products(){
        return $this->hasMany(Product::class);
    }

    public function customers(){
        return $this->hasMany(Customer::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    public function order_references(){
        return $this->hasMany(OrderReference::class);
    }


}
