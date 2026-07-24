<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\TicketRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with(['categoria', 'solicitante', 'responsavel'])->paginate(10);
        return response()->json($tickets);
    }

    // criar chamado
    public function store(TicketRequest $request)
    {
        $data = $request->validated();
        $data['solicitante_id'] = auth()->id();
        $data['status'] = 'Aberto';
        
        $ticket = Ticket::create($data);

        return response()->json($ticket, 201);
    }

    // visualizar detalhes do chamado
    public function show($id)
    {
        $ticket = Ticket::with(['categoria', 'solicitante', 'responsavel'])->findOrFail($id);
        return response()->json($ticket);
    }

    // atualizar chamado
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        
        if ($request->status === 'Finalizado' && $ticket->comentarios()->count() === 0) {
            return response()->json(['error' => 'Um chamado somente poderá ser finalizado caso possua pelo menos um comentário contendo a solução aplicada.'], 403);
        }

        // atualiza apenas campos permitidos
        $ticket->update($request->only([
            'assunto', 'descricao', 'categoria_id', 'prioridade', 'status', 'prazo_atendimento', 'responsavel_id'
        ]));

        return response()->json($ticket);
    }

    // excluir chamado
    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);

        if ($ticket->status === 'Finalizado') {
            return response()->json(['error' => 'Chamados finalizados não poderão ser excluídos.'], 403);
        }

        $ticket->delete();

        return response()->json(['message' => 'Chamado excluído com sucesso.']);
    }
}