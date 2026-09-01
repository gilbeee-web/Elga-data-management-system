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
        //

        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_transaction_number_unique');

            $table->unique(
                ['shop_id', 'transaction_number'],
                'orders_shop_transaction_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique('orders_shop_transaction_unique');

            $table->unique('transaction_number');
        });
    }
};
