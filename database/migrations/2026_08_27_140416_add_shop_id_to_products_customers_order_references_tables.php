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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('shop_id')
                ->after('id')
                ->constrained('shops')
                ->restrictOnDelete();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('shop_id')
                ->after('id')
                ->constrained('shops')
                ->restrictOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('shop_id')
                ->after('id')
                ->constrained('shops')
                ->restrictOnDelete();
        });

        Schema::table('order_references', function (Blueprint $table) {
            $table->foreignId('shop_id')
                ->after('id')
                ->constrained('shops')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });

        Schema::table('order_references', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });
    }
};
