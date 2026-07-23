<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            ['nome' => 'Infraestrutura', 'descricao' => 'Problemas físicos e estruturais.'],
            ['nome' => 'Rede', 'descricao' => 'Falhas de conexão e internet.'],
            ['nome' => 'Impressoras', 'descricao' => 'Manutenção e suprimentos.'],
            ['nome' => 'Sistema', 'descricao' => 'Erros em softwares e ERP.'],
            ['nome' => 'Hardware', 'descricao' => 'Manutenção de computadores e peças.']
        ];

        foreach ($categorias as $categoria) {
            Category::create($categoria);
        }
    }
}
