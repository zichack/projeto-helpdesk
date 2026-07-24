<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id')->toArray();
        $categories = Category::pluck('id')->toArray();

        if (empty($users) || empty($categories)) {
            return;
        }

        $assuntos = [
            'Computador não liga após queda de energia',
            'Erro de conexão com a VPN corporativa',
            'Impressora do financeiro travada com papel',
            'Solicitação de acesso ao sistema ERP',
            'Lentidão extrema na rede Wi-Fi do escritório',
            'Tela azul recorrente na estação de trabalho',
            'Troca de cartucho de toner da recepção',
            'Falha ao autenticar no e-mail corporativo',
            'Configuração de nova máquina para colaborador',
            'Sistema de chamados exibindo erro 500',
            'Atualização de software antivírus pendente',
            'Mouse e teclado sem fio não respondem',
            'Acesso negado na pasta compartilhada da diretoria',
            'Projetor da sala de reuniões sem sinal de vídeo',
            'Queda constante na conexão de internet cabeada'
        ];

        $prioridades = ['Baixa', 'Média', 'Alta', 'Crítico'];
        $statusList = ['Aberto', 'Em Atendimento', 'Aguardando Usuário', 'Finalizado'];

        for ($i = 0; $i < 15; $i++) {
            Ticket::create([
                'assunto' => $assuntos[$i],
                'descricao' => 'Descrição detalhada gerada automaticamente para testes do chamado técnico #' . ($i + 1),
                'categoria_id' => $categories[array_rand($categories)],
                'prioridade' => $prioridades[array_rand($prioridades)],
                'status' => $statusList[array_rand($statusList)],
                'solicitante_id' => $users[array_rand($users)],
                'responsavel_id' => rand(0, 1) ? $users[array_rand($users)] : null,
                'prazo_atendimento' => Carbon::now()->addDays(rand(1, 15))->toDateString(),
            ]);
        }
    }
}