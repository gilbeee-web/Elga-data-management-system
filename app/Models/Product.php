<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = ['shop_id','name','category','image'];

    public function variants(){
        return $this->hasMany(ProductVariant::class);
    }

    public function shop(){
        return $this->belongsTo(Shop::class);
    }


}
