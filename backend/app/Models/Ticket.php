<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'assunto',
        'descricao',
        'categoria_id',
        'prioridade',
        'status',
        'responsavel_id',
        'solicitante_id',
        'prazo_atendimento'
    ];

    public function categoria()
    {
        return $this->belongsTo(Category::class, 'categoria_id');
    }

    public function solicitante()
    {
        return $this->belongsTo(User::class, 'solicitante_id');
    }

    public function responsavel()
    {
        return $this->belongsTo(User::class, 'responsavel_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Comment::class);
    }
}