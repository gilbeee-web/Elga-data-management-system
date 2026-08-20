<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
            $table->enum('order_type', ['shipment', 'walkin'])->after('transaction_number');
            $table->timestamp('completed_at')->nullable()->after('remarks');
            $table->string('receiver_name')->nullable()->change();
            $table->string('contact_number')->nullable()->change();
            $table->string('address')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
            DB::table('orders')->where('order_type', 'walk_in')->delete();
            $table->dropColumn('order_type');
            $table->string('receiver_name')->nullable(false)->change();
            $table->string('address')->nullable(false)->change();
        });
    }
};
