# 🎫 Projeto HelpDesk

Sistema de Gestão de Chamados de TI desenvolvido como solução para o teste prático de Desenvolvedor Full Stack. A aplicação é composta por uma API REST em Laravel e uma interface web em React, atendendo aos requisitos do desafio proposto, incluindo autenticação JWT, dashboard, gerenciamento de categorias, CRUD de chamados, comentários, histórico automático de alterações e regras de negócio.

---

## 📖 Sobre o projeto

O Projeto HelpDesk é uma aplicação web para gerenciamento de chamados técnicos, permitindo o cadastro, acompanhamento e resolução de solicitações por clientes e equipes de suporte.

O projeto foi desenvolvido utilizando uma arquitetura separada entre front-end e back-end:

- **Back-end:** API RESTful em Laravel
- **Front-end:** React + Vite
- **Autenticação:** JWT
- **Banco de dados:** MySQL

---

## ✨ Funcionalidades

- Autenticação JWT
- Cadastro de usuários
- Dashboard com indicadores
- Cadastro de categorias
- CRUD completo de chamados
- Pesquisa por assunto e solicitante
- Filtros por categoria, prioridade e status
- Ordenação de resultados
- Paginação
- Comentários nos chamados
- Histórico automático das alterações

---

## 🚀 Tecnologias

### Back-end

- PHP 8.2+
- Laravel
- Eloquent ORM
- Migrations
- Seeders
- Observers
- JWT Auth
- MySQL

### Front-end

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

---

## 🗄️ Banco de Dados

A estrutura do banco de dados foi criada utilizando Laravel Migrations e os dados iniciais são carregados através de Seeders, permitindo recriar completamente o ambiente de desenvolvimento com um único comando.

```bash
php artisan migrate:fresh --seed
```

---

## 📋 Pré-requisitos

- PHP 8.2+
- Composer
- Node.js
- npm
- MySQL
- XAMPP (opcional)

---

## ⚙️ Instalação

### 1. Clone o projeto

```bash
git clone https://github.com/zichack/projeto-helpdesk.git
cd projeto-helpdesk
```

---

### 2. Configurando o Back-end

```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
```

Configure o arquivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=projeto_helpdesk
DB_USERNAME=root
DB_PASSWORD=
```

Execute as migrations:

```bash
php artisan migrate:fresh --seed
```

---

### 3. Configurando o Front-end

```bash
cd frontend
npm install
```

---

## ▶️ Executando

### Back-end

```bash
cd backend
php artisan serve
```

API:

```
http://127.0.0.1:8000
```

---

### Front-end

```bash
cd frontend
npm run dev
```

Aplicação:

```
http://localhost:5173
```

---

## 🔑 Usuários de teste

### Administrador

```
Email: admin@helpdesk.com
Senha: senha123
```

### Suporte 1

```
Email: suporte@helpdesk.com
Senha: senha123
```

---

### Suporte 2

```
Email: carlos@helpdesk.com
Senha: senha123
```
---

## 🏗️ Estrutura do Projeto

```text
projeto-helpdesk/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Observers/
│   │   └── Providers/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── public/
│   ├── resources/
│   │   ├── css/
│   │   ├── js/
│   │   └── views/
│   ├── routes/
│   ├── storage/
│   └── tests/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── contexts/
│       ├── pages/
│       └── services/
│
└── README.md
```

### Organização

- **backend/**: API REST desenvolvida em Laravel, responsável pela autenticação, regras de negócio, persistência de dados e gerenciamento dos chamados.
- **frontend/**: Aplicação React responsável pela interface do usuário e consumo da API REST.

---

## 🏗️ Decisões Técnicas

### API REST

Toda comunicação entre cliente e servidor ocorre através de JSON utilizando os verbos HTTP REST.

### JWT

Autenticação Stateless baseada em tokens.

### Observer

Foi utilizado um `TicketObserver` para centralizar o registro automático do histórico dos chamados, mantendo a lógica de auditoria desacoplada dos controllers e facilitando a manutenção do código.

### Histórico Humanizado

Os registros exibem nomes de usuários e categorias em vez de IDs.

### Regras de negócio

- Apenas usuários autenticados podem acessar o sistema.
- Todos os endpoints da API (exceto autenticação) são protegidos por JWT.
- Chamados somente podem ser finalizados após possuir ao menos um comentário contendo a solução aplicada.
- Chamados finalizados não podem ser excluídos.
- Toda alteração realizada em um chamado gera automaticamente um registro no histórico.
- Validação dos status e níveis de prioridade permitidos pelo sistema.

---

## 👨‍💻 Autor

Desenvolvido por **Mateus Zichack**.