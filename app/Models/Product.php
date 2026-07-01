<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = ['name', 'category'];

    public function product_variants(){
        return $this->hasMany(ProductVariant::class);
    }


}
