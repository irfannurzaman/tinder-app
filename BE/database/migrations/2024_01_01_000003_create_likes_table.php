<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('people_id')->constrained('people')->onDelete('cascade');
            $table->string('device_id');
            $table->enum('action', ['like', 'dislike'])->default('like');
            $table->timestamps();

            $table->unique(['people_id', 'device_id']);
            $table->index('people_id');
            $table->index('device_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};



