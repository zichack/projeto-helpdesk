<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\History;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        //
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        $changes = $ticket->getChanges();
        
        foreach ($changes as $column => $newValue) {
            if ($column !== 'updated_at') {
                History::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => auth()->id() ?? $ticket->solicitante_id,
                    'alteracao_realizada' => "O campo '{$column}' foi alterado para '{$newValue}'."
                ]);
            }
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
