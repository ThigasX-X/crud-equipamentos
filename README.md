# Sistema de Gerenciamento de Ativos de TI

Sistema desenvolvido como teste técnico para o **UNICEPLAC** — Gerenciamento completo do inventário de equipamentos de TI com autenticação JWT, filtros, e exportação de relatórios.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS 10 + TypeScript |
| Frontend | React 19 + Vite |
| Banco de Dados | PostgreSQL 15 |
| ORM | TypeORM |
| Autenticação | JWT (passport-jwt) |
| Containerização | Docker + Docker Compose |

---

## Pré-requisitos

- **Node.js** 20+
- **npm** 10+
- **Docker** + **Docker Compose**

---

## Variáveis de Ambiente

O projeto usa um arquivo `.env` na raiz, gerado a partir do `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` e preencha os valores:

```env
DB_USERNAME=crudEquipamentos
DB_PASSWORD=sua_senha_aqui
DB_NAME=UNICEPLAC_EQUIPAMENTOS

JWT_SECRET=gere_um_secret_seguro_aqui
JWT_EXPIRES_IN=2h
PORT=3000

# (opcional) URL do frontend para CORS em produção
# FRONTEND_URL=http://localhost:5173
```

> O `JWT_SECRET` pode ser gerado com: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

---

## Instalação e Execução

### Opção 1 — Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd crud-equipamentos

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba todos os serviços
docker compose up -d --build
```

Acesse:
- **Frontend**: http://localhost
- **API**: http://localhost:3000

Para acompanhar os logs:
```bash
docker compose logs -f
```

Para parar os serviços:
```bash
docker compose down
```

---

### Opção 2 — Execução Local (sem Docker)

#### 1. Suba apenas o banco de dados via Docker

```bash
docker run -d \
  --name it-assets-db \
  -e POSTGRES_DB=UNICEPLAC_EQUIPAMENTOS \
  -e POSTGRES_USER=crudEquipamentos \
  -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. Inicie o Backend

```bash
cd apps/backend
npm install
npm run start:dev
```

#### 3. Inicie o Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---


## Conexão ao Banco de Dados (DBeaver / pgAdmin / TablePlus)

### Credenciais de acesso

| Parâmetro | Valor |
|-----------|-------|
| Host | `localhost` |
| Porta | `5432` |
| Banco | `UNICEPLAC_EQUIPAMENTOS` |
| Usuário | `crudEquipamentos` |
| Senha | `123456` |

---

### Passo a passo — DBeaver

1. Abra o **DBeaver** e clique em **Nova Conexão** (ícone de tomada no canto superior esquerdo, ou `Ctrl+Shift+N`)

2. Na janela de seleção, escolha **PostgreSQL** e clique em **Próximo**

3. Preencha os campos na aba **Principal**:
   - **Host**: `localhost`
   - **Porta**: `5432`
   - **Database**: `UNICEPLAC_EQUIPAMENTOS`
   - **Usuário**: `crudEquipamentos`
   - **Senha**: `123456`

4. Clique em **Testar Conexão**
   - Se aparecer a mensagem **"Connected"**, a conexão está funcionando
   - Se pedir para baixar o driver do PostgreSQL, clique em **Baixar** e tente novamente

5. Clique em **Concluir**

6. A conexão aparecerá no painel esquerdo. Expanda:
   ```
   localhost:5432/UNICEPLAC_EQUIPAMENTOS
   └── Schemas
       └── public
           └── Tables
               ├── users
               └── equipments
   ```

> **Atenção:** o banco e as tabelas só existem após `docker compose up` ou `npm run start:dev` (o TypeORM cria as tabelas automaticamente na primeira execução).

---

### Passo a passo — pgAdmin 4

1. Abra o **pgAdmin** e clique com o botão direito em **Servers → Register → Server**

2. Na aba **General**: defina um nome (ex: `IT Assets Local`)

3. Na aba **Connection** preencha:
   - **Host name/address**: `localhost`
   - **Port**: `5432`
   - **Maintenance database**: `UNICEPLAC_EQUIPAMENTOS`
   - **Username**: `crudEquipamentos`
   - **Password**: `123456`

4. Clique em **Save** — o servidor aparecerá na árvore lateral

---

### Passo a passo — TablePlus / DBeaver (string de conexão direta)

Se preferir usar uma string de conexão:

```
postgresql://crudEquipamentos:123456@localhost:5432/UNICEPLAC_EQUIPAMENTOS
```

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastro de usuário | — |
| POST | `/auth/login` | Login — retorna JWT | — |

### Equipamentos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/equipments` | Criar equipamento | ✅ |
| GET | `/equipments` | Listar com paginação | ✅ |
| GET | `/equipments?type=MONITOR` | Filtrar por tipo | ✅ |
| GET | `/equipments?status=ACTIVE` | Filtrar por status | ✅ |
| GET | `/equipments?page=2&limit=10` | Controle de paginação | ✅ |
| GET | `/equipments/:id` | Buscar por ID | ✅ |
| PUT | `/equipments/:id` | Atualizar todos os campos | ✅ |
| PATCH | `/equipments/:id` | Atualizar campos parciais | ✅ |
| DELETE | `/equipments/:id` | Remover equipamento | ✅ |

### Exportação de Relatórios

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/equipments/export/csv` | Exportar lista em CSV | ✅ |
| GET | `/equipments/export/json` | Exportar lista em JSON | ✅ |

> Os filtros `?type=`, `?status=`, `?page=` e `?limit=` (padrão: 20, máx: 100) também funcionam nos endpoints de exportação, exceto `page`/`limit` que não se aplicam à exportação completa.

#### Resposta paginada

```
{
  "data": [ /* array de equipamentos */ ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

## Campos do Equipamento

| Campo | Tipo | Valores Aceitos |
|-------|------|-----------------|
| `name` | string | Nome do equipamento |
| `type` | enum | `MONITOR`, `CPU`, `KEYBOARD` |
| `acquisitionDate` | string | Formato `YYYY-MM-DD` |
| `status` | enum | `ACTIVE`, `MAINTENANCE` |

---

## Exportação CSV/JSON

### Via Interface Web

No Dashboard, clique em **Exportar** (canto superior direito) e escolha CSV ou JSON. Os filtros ativos são aplicados automaticamente.

### Via cURL

```bash
# 1. Faça login e obtenha o token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"sua_senha"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Exportar todos como CSV
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/equipments/export/csv \
  -o equipamentos.csv

# 3. Exportar monitores em manutenção como JSON
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/equipments/export/json?type=MONITOR&status=MAINTENANCE" \
  -o monitores_manutencao.json
```

---

## Estrutura do Projeto

```
crud-equipamentos/
├── apps/
│   ├── backend/              # NestJS API
│   │   └── src/
│   │       ├── auth/         # Autenticação JWT
│   │       ├── equipment/    # CRUD de Equipamentos
│   │       ├── users/        # Gestão de Usuários
│   │       └── common/       # Global Exception Filter
│   └── frontend/             # React + Vite
│       └── src/
│           ├── components/   # Componentes reutilizáveis
│           ├── pages/        # Dashboard, Formulário, Auth
│           ├── hooks/        # useAuth, useEquipments
│           └── services/     # Clientes HTTP (Axios)
├── .env                      # Credenciais (não versionar)
├── .env.example              # Modelo de variáveis
├── docker-compose.yml
└── README.md
```

---

## Decisões de Arquitetura

- **Separação de responsabilidades**: cada módulo NestJS contém controller, service, entity e DTOs próprios
- **Global Exception Filter**: centraliza o tratamento de erros com resposta padronizada `{ statusCode, error, message, timestamp }`
- **Validação**: `class-validator` no backend; validação em tempo real no frontend com feedback visual por campo
- **JWT stateless**: tokens com expiração de 2h, sem armazenamento em banco
- **Nginx como proxy reverso**: em produção (Docker), o Nginx serve o frontend e faz proxy das chamadas de API para o container backend
- **Exportação**: os endpoints `/export/csv` e `/export/json` respeitam os filtros da listagem e fazem download direto via `Content-Disposition: attachment`
