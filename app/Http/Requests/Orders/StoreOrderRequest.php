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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orderReferences' => ['required', 'array', 'min:1'],
            'orderReferences.*.order_number' => ['required', 'string', 'max:255'],
            'orderReferences.*.items' => ['required', 'array', 'min:1'],

            'orderReferences.*.items.*.id' => ['required', 'integer', 'exists:products,id'],
            'orderReferences.*.items.*.selected_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'orderReferences.*.items.*.qty' => ['required', 'integer', 'min:1'],
            'orderReferences.*.items.*.discount' => ['nullable', 'numeric', 'min:0'],
            'orderReferences.*.items.*.variant_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'orderReferences.required' => 'At least one order reference is required.',
            'orderReferences.*.order_number.required' => 'Each order reference must have an order number.',
            'orderReferences.*.items.required' => 'Each order reference must have at least one item.',
            'orderReferences.*.items.*.selected_variant_id.exists' => 'The selected product variant does not exist.',
            'orderReferences.*.items.*.qty.min' => 'Quantity must be at least 1.',
        ];
    }

}
