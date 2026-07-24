<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CommentController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('/categorias', CategoryController::class);

    Route::get('/chamados/estatisticas', [TicketController::class, 'estatisticas']);

    Route::apiResource('/chamados', TicketController::class);
    Route::post('/chamados/{ticket}/comentarios', [CommentController::class, 'store']);
    Route::patch('chamados/{id}/finalizar', [TicketController::class, 'finalizar']);
});