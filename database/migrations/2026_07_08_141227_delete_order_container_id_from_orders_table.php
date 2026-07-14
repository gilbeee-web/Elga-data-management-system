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
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->dropForeign(['order_container_id']);
            $table->dropColumn('order_container_id');
            $table->dropColumn('raw_shipping_fee');
            $table->dropColumn('container_fee');
            $table->dropColumn('total_shipping_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //

            $table->decimal('raw_shipping_fee', 12, 2)->default(0);

            $table->foreignId('order_container_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete()
            ->after('raw_shipping_fee');
            
            $table->decimal('container_fee', 12, 2)->default(0);
            $table->decimal('total_shipping_fee', 12, 2)->default(0);
        });
    }
};
