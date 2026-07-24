<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assunto' => 'required|string|max:255',
            'descricao' => 'required|string',
            'categoria_id' => 'required|exists:categories,id',
            'prioridade' => 'required|in:Baixa,Média,Alta',
            'prazo_atendimento' => 'required|date|after_or_equal:today',
            'responsavel_id' => 'nullable|exists:users,id'
        ];
    }
}
