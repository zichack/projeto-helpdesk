<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\History;
use App\Http\Requests\TicketRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['categoria', 'solicitante', 'responsavel']);

        if ($request->filled('assunto')) {
            $query->where('assunto', 'like', '%' . $request->assunto . '%');
        }

        if ($request->filled('solicitante')) {
            $query->whereHas('solicitante', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->solicitante . '%');
            });
        }

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }
        if ($request->filled('prioridade')) {
            $query->where('prioridade', $request->prioridade);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orderBy = $request->input('order_by', 'created_at');
        $orderDir = $request->input('order_dir', 'desc');
        
        $allowedColumns = ['id', 'assunto', 'status', 'prioridade', 'created_at', 'prazo_atendimento'];
        if (in_array($orderBy, $allowedColumns) && in_array(strtolower($orderDir), ['asc', 'desc'])) {
            $query->orderBy($orderBy, $orderDir);
        }

        $tickets = $query->paginate(10)->appends($request->all());

        return response()->json($tickets);
    }

    // criar chamado
    public function store(TicketRequest $request)
    {
        $data = $request->validated();
        $data['solicitante_id'] = auth()->id();
        $data['status'] = 'Aberto';
        
        $ticket = Ticket::create($data);

        // registra histórico de criação
        History::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'alteracao_realizada' => 'Chamado criado'
        ]);

        return response()->json($ticket, 201);
    }

    // visualizar detalhes do chamado
    public function show($id)
    {
        $ticket = Ticket::with([
            'categoria', 
            'solicitante', 
            'responsavel', 
            'comentarios', 
            'histories.user'
        ])->findOrFail($id);
        
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
            'status' => 'sometimes|in:Crítico,Aberto,Em Atendimento,Aguardando Usuário,Finalizado',
            'prazo_atendimento' => 'sometimes|date',
            'responsavel_id' => 'nullable|exists:users,id'
        ]);
        
        if ($request->status === 'Finalizado' && $ticket->comentarios()->count() === 0) {
            return response()->json(['error' => 'Um chamado somente poderá ser finalizado caso possua pelo menos um comentário contendo a solução aplicada.'], 403);
        }

        $userId = auth()->id();

        // detecta mudanças para registrar no histórico
        if (isset($validatedData['status']) && $ticket->status !== $validatedData['status']) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Status alterado de '{$ticket->status}' para '{$validatedData['status']}'"
            ]);
        }

        if (isset($validatedData['prioridade']) && $ticket->prioridade !== $validatedData['prioridade']) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Prioridade alterada de '{$ticket->prioridade}' para '{$validatedData['prioridade']}'"
            ]);
        }

        if (array_key_exists('responsavel_id', $validatedData) && $ticket->responsavel_id !== $validatedData['responsavel_id']) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Responsável alterado"
            ]);
        }

        if (isset($validatedData['categoria_id']) && $ticket->categoria_id !== $validatedData['categoria_id']) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Categoria alterada"
            ]);
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

        History::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'alteracao_realizada' => "Status alterado para Finalizado"
        ]);

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
            'atrasados' => Ticket::where('status', '!=', 'Finalizado')
                                 ->whereDate('prazo_atendimento', '<', $hoje)
                                 ->count(),
        ]);
    }
}