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
        Schema::table('tasks', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['assigned_user_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['project_id']);
            // Then, modify the column to be nullable
            $table->unsignedBigInteger('assigned_user_id')->nullable()->change();
            $table->unsignedBigInteger('created_by')->nullable()->change();
            $table->unsignedBigInteger('updated_by')->nullable()->change();
            $table->unsignedBigInteger('project_id')->nullable()->change();

            $table->foreign('assigned_user_id')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->foreign('created_by')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->foreign('project_id')->nullable()->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['assigned_user_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['project_id']);

            $table->foreignId('assigned_user_id')->constrained('users');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->foreignId('project_id')->constrained('projects');
        });
    }
};
