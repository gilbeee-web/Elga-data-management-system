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
        Schema::table('shipments', function (Blueprint $table) {
            //
            $table->foreignId('order_container_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete()
            ->after('order_id');

            $table->renameColumn('shipping_fee', 'raw_shipping_fee');
            $table->decimal('container_fee', 12, 2)->default(0)->after('raw_shipping_fee');
            $table->decimal('total_shipping_fee', 12, 2)->default(0)->after('container_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            //
            $table->renameColumn('raw_shipping_fee', 'shipping_fee');
            
            $table->dropColumn('container_fee');
            $table->dropColumn('total_shipping_fee');

            $table->dropForeign(['order_container_id']);
            $table->dropColumn('order_container_id');
        });
    }
};
