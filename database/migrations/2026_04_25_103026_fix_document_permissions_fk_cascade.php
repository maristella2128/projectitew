<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_permissions', function (Blueprint $table) {
            // Drop the old constraint without cascade
            $table->dropForeign(['document_id']);

            // Re-add with cascade so deleting a document removes its permissions too
            $table->foreign('document_id')
                  ->references('id')
                  ->on('documents')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('document_permissions', function (Blueprint $table) {
            $table->dropForeign(['document_id']);

            $table->foreign('document_id')
                  ->references('id')
                  ->on('documents');
        });
    }
};
