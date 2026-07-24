<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\History;
use App\Models\User;
use App\Models\Category;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        History::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id() ?? $ticket->solicitante_id,
            'alteracao_realizada' => 'Chamado criado'
        ]);
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        $userId = auth()->id() ?? $ticket->solicitante_id;

        if ($ticket->isDirty('status')) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Status alterado de '{$ticket->getOriginal('status')}' para '{$ticket->status}'"
            ]);
        }

        if ($ticket->isDirty('prioridade')) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Prioridade alterada de '{$ticket->getOriginal('prioridade')}' para '{$ticket->prioridade}'"
            ]);
        }

        if ($ticket->isDirty('responsavel_id')) {
            $antigoId = $ticket->getOriginal('responsavel_id');
            $novoId = $ticket->responsavel_id;

            $antigoNome = $antigoId ? (User::find($antigoId)?->name ?? 'Desconhecido') : 'Não atribuído';
            $novoNome = $novoId ? (User::find($novoId)?->name ?? 'Desconhecido') : 'Não atribuído';

            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Responsável alterado de '{$antigoNome}' para '{$novoNome}'"
            ]);
        }

        if ($ticket->isDirty('categoria_id')) {
            $antigoId = $ticket->getOriginal('categoria_id');
            $novoId = $ticket->categoria_id;

            $antigoNome = $antigoId ? (Category::find($antigoId)?->nome ?? 'Desconhecida') : 'Não informada';
            $novoNome = $novoId ? (Category::find($novoId)?->nome ?? 'Desconhecida') : 'Não informada';

            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
                'alteracao_realizada' => "Categoria alterada de '{$antigoNome}' para '{$novoNome}'"
            ]);
        }
    }

    /**
     * Handle the Ticket "deleted" event.
     */
    public function deleted(Ticket $ticket): void
    {
        //
    }

    /**
     * Handle the Ticket "restored" event.
     */
    public function restored(Ticket $ticket): void
    {
        //
    }

    /**
     * Handle the Ticket "force deleted" event.
     */
    public function forceDeleted(Ticket $ticket): void
    {
        //
    }
}