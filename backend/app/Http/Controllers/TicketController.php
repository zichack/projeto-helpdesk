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
        
        $validatedData = $request->validate([
            'assunto' => 'sometimes|string|max:255',
            'descricao' => 'sometimes|string',
            'categoria_id' => 'sometimes|exists:categories,id',
            'prioridade' => 'sometimes|in:Baixa,Média,Alta',
            'status' => 'sometimes|in:Crítica,Aberto,Em Atendimento,Aguardando Usuário,Finalizado',
            'prazo_atendimento' => 'sometimes|date',
            'responsavel_id' => 'nullable|exists:users,id'
        ]);
        
        if ($request->status === 'Finalizado' && $ticket->comentarios()->count() === 0) {
            return response()->json(['error' => 'Um chamado somente poderá ser finalizado caso possua pelo menos um comentário contendo a solução aplicada.'], 403);
        }

        $ticket->update($validatedData);

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

    public function finalizar($id)
    {
        $ticket = Ticket::findOrFail($id);

        if ($ticket->comentarios()->count() === 0) {
            return response()->json(['error' => 'Não é possível finalizar um chamado sem adicionar um comentário com a solução.'], 403);
        }

        $ticket->update(['status' => 'Finalizado']);

        return response()->json($ticket);
    }

    public function estatisticas()
    {
        $hoje = now()->toDateString();
        
        return response()->json([
            'total' => Ticket::count(),
            'abertos' => Ticket::where('status', 'Aberto')->count(),
            'em_atendimento' => Ticket::where('status', 'Em Atendimento')->count(),
            'finalizados' => Ticket::where('status', 'Finalizado')->count(),
            // Atrasados: Status diferente de Finalizado com prazo menor que a data de hoje
            'atrasados' => Ticket::where('status', '!=', 'Finalizado')
                                 ->whereDate('prazo_atendimento', '<', $hoje)
                                 ->count(),
        ]);
    }
}