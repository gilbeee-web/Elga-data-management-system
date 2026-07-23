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
        Schema::table('shipments', function (Blueprint $table) {
            //

            $table->dropForeign(['order_container_id']);
            $table->dropColumn('order_container_id');

            $table->enum('container_type', ['box', 'pouch'])->after('courier');
            $table->enum('container_size', ['extra-small', 'small', 'medium', 'large'])->after('container_type');

        });

        Schema::dropIfExists('order_containers');
        


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::create('order_containers', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['box', 'pouch']);
            $table->enum('size', ['extra-small', 'small', 'medium', 'large']);
            $table->unsignedInteger('charge');
            $table->timestamps();
        });

        Schema::table('shipments', function (Blueprint $table) {
            //
            $table->foreignId('order_container_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

            $table->dropColumn(['container_type', 'container_size']);
        });
    }
};
