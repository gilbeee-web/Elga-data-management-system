<?php

namespace App\Http\Requests\Orders;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'orderReferences' => ['required', 'array', 'min:1'],

            'orderReferences.*.order_number' => [
                'required',
                'string',
                'max:255',
            ],

            'orderReferences.*.items' => [
                'required',
                'array',
                'min:1',
            ],

            'orderReferences.*.items.*.id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'orderReferences.*.items.*.selected_variant_id' => [
                'required',
                'integer',
                'exists:product_variants,id',
            ],

            'orderReferences.*.items.*.qty' => [
                'required',
                'integer',
                'min:1',
            ],

            'orderReferences.*.items.*.discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'orderReferences.*.items.*.variant_price' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];

        foreach ($this->input('orderReferences', []) as $index => $reference) {

            $rules["orderReferences.$index.order_number"] = [
                'required',
                'string',
                'max:255',
                Rule::unique('order_references', 'order_number')
                    ->ignore($reference['id'] ?? null),
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        $messages = [
            'orderReferences.required' =>
                'At least one order reference is required.',

            'orderReferences.*.order_number.required' =>
                'Each order reference must have an order number.',

            'orderReferences.*.items.required' =>
                'Each order reference must have at least one item.',

            'orderReferences.*.items.*.selected_variant_id.exists' =>
                'The selected product variant does not exist.',

            'orderReferences.*.items.*.qty.min' =>
                'Quantity must be at least 1.',
        ];

        foreach ($this->input('orderReferences', []) as $index => $reference) {
            $messages["orderReferences.$index.order_number.unique"] =
                "Order number #{$reference['order_number']} already exists.";
        }

        return $messages;
    }

}
