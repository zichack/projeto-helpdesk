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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('assunto');
            $table->text('descricao');
            $table->foreignId('categoria_id')->constrained('categories');
            $table->enum('prioridade', ['Baixa', 'Média', 'Alta']);
            $table->enum('status', ['Crítica', 'Aberto', 'Em Atendimento', 'Aguardando Usuário', 'Finalizado'])->default('Aberto');
            $table->foreignId('responsavel_id')->nullable()->constrained('users');
            $table->foreignId('solicitante_id')->constrained('users');
            $table->date('prazo_atendimento');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
