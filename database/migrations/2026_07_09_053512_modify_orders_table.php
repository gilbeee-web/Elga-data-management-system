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
            $table->foreignId('customer_id')->nullable()->change();
            $table->string('transaction_number')->nullable()->change();
            $table->decimal('remaining_balance', 12, 2)->nullable()->change();
            $table->string('remarks')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->foreignId('customer_id')->nullable(false)->change();
            $table->string('transaction_number')->nullable(false)->change();
        });
    }
};
