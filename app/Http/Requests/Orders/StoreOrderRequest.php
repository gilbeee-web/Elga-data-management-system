<?php

namespace App\Http\Requests\Orders;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'customer_name' => [
                'required',
                'string',
                'max:255'
            ],

            //need to have at least 1 order
            'order_items' => [
                'required',
                'array',
                'min:1'
            ],

            'order_items.*.item_name' => [
                'required',
                'string'
            ],

            'order_items.*.qty' => [
                'required',
                'integer',
                'min:1'
            ],

            'order_items.*.price' => [
                'required',
                'numeric',
                'min:0'
            ],

            'order_items.*.discount' => [
                'nullable',
                'numeric',
                'min:0'
            ]
        ];
    }
}
