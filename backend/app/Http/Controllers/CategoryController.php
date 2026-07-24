<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string'
        ]);

        $categoria = Category::create($data);
        return response()->json($categoria, 201);
    }

    public function update(Request $request, $id)
    {
        $categoria = Category::findOrFail($id);

        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string'
        ]);

        $categoria->update($data);
        return response()->json($categoria);
    }

    public function destroy($id)
    {
        $categoria = Category::findOrFail($id);
        
        if ($categoria->tickets()->count() > 0) {
            return response()->json(['error' => 'Não é possível excluir uma categoria que possui chamados vinculados.'], 403);
        }

        $categoria->delete();
        return response()->json(['message' => 'Categoria excluída com sucesso.']);
    }
}