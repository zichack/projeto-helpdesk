<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['texto', 'ticket_id', 'user_id'];
    
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}