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
            $table->string('sender_name')->nullable()->after('transaction_number');
            $table->string('receiver_name')->nullable()->after('sender_name');
            $table->string('contact_number')->nullable()->after('receiver_name');
            $table->string('address')->nullable()->after('contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //

            $table->dropColumn([
                'sender_name',
                'receiver_name',
                'contact_number',
                'address'
            ]);

        });
    }
};
