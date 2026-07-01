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
            $table->foreignId('customer_id')->after('transaction_number')->constrained()->cascadeOnDelete();
            $table->dropColumn('customer_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //

            $table->string('customer_name')->after('transaction_number');

            $table->dropForeign(['customer_id']);
            $table->dropColumn('customer_id');
        });
    }
};
