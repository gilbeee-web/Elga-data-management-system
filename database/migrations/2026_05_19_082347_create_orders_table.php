<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->decimal('subtotal', 12, 2);

            $table->decimal('raw_shipping_fee', 12, 2)->default(0);
            $table->decimal('container_fee', 12, 2)->default(0);
            $table->decimal('total_shipping_fee', 12, 2)->default(0);

            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);

            $table->enum('payment_status', [
                'unpaid',
                'partial',
                'paid'
            ])->default('unpaid');

            $table->enum('order_status', [
                'draft', //default when shipping fee is not created yet
                'awaiting_shipping_fee', //order created, shipping fee is not yet encoded
                'awaiting_payment', //shipping fee created, waiting for payment (so meaning in partial payment or down payment the order status will just be pending)
                'payment_confirmed', // all payments are settled
                'processing', //after payment, the receipt will be printed in other system then processing of packing the order
                'shipped', // after the order is prepared and ready to ship, the user will fill up the shipment form including the shipping fee payment reference number and shipped_at
                'completed', // after the fill up of shipment form the order status is completed
                'cancelled'
            ])->default('draft');

            $table->decimal('remaining_balance', 12, 2)->default(0);
            $table->string('remarks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
