# 🚚 SAGA Food Truck - Sistema de Gerenciamento

> Sistema completo de gerenciamento para food trucks com backend Node.js + PostgreSQL e frontend React + Redux

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)](https://expressjs.com/)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [Estrutura do Banco](#estrutura-do-banco)
- [API Endpoints](#api-endpoints)
- [Documentação Adicional](#documentação-adicional)

---

## 🎯 Sobre o Projeto

Sistema web completo para gerenciamento de food trucks, desenvolvido como projeto acadêmico. Permite controle de produtos, pedidos, estoque e relatórios em tempo real.

### ✨ Destaques Técnicos

- 🔒 **Segurança:** Queries parametrizadas, soft delete, validações
- ⚡ **Performance:** Connection pooling, índices otimizados
- 🔄 **ACID:** Transações para pedidos (orders + order_items)
- 🤖 **Automação:** Triggers para timestamps, status e auditoria
- 📊 **Views:** Estatísticas e relatórios pré-calculados
- 🎨 **UX:** Interface responsiva e intuitiva

---

## 🚀 Funcionalidades

### Backend (API REST)
- ✅ Autenticação de usuários (admin/atendente)
- ✅ CRUD completo de Produtos
- ✅ CRUD completo de Pedidos (com itens)
- ✅ Gerenciamento de estoque automático
- ✅ Auditoria de operações
- ✅ Estatísticas e relatórios

### Frontend (SPA React)
- ✅ Dashboard com métricas em tempo real
- ✅ Gerenciamento de produtos (com categorias)
- ✅ Gerenciamento de pedidos
- ✅ Sistema de login e rotas protegidas
- ✅ Estado global com Redux

---

## 🛠️ Tecnologias

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express 4.18** - Framework web
- **PostgreSQL 15** - Banco de dados relacional
- **pg 8.16** - Driver PostgreSQL
- **dotenv** - Variáveis de ambiente
- **cors** - Controle de origem

### Frontend
- **React 18** - Biblioteca UI
- **Redux Toolkit 2.0** - Gerenciamento de estado
- **React Router 6** - Roteamento
- **Vite 5** - Build tool e dev server

### DevOps
- **Docker Compose** - Orquestração de containers
- **Git** - Controle de versão

---

## 📦 Como Executar

### Pré-requisitos

- Node.js 20+ instalado
- Docker Desktop (para PostgreSQL)
- Git

### 1️⃣ Clonar Repositório

```bash
git clone https://github.com/gabschlemper/saga_food_truck.git
cd saga_food_truck
```

### 2️⃣ Configurar Banco de Dados

```bash
# Iniciar PostgreSQL com Docker
docker-compose up -d

# Verificar se está rodando
docker ps
# Deve mostrar: postgres:15-alpine na porta 5432

# O banco será criado automaticamente com dados iniciais
```

### 3️⃣ Configurar Backend

```bash
cd back

# Instalar dependências
npm install

# Criar arquivo .env (ou usar o existente)
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=usuario
DB_PASSWORD=usuario123
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
EOF

# Iniciar servidor
node server.js
# Backend rodando em http://localhost:3000
```

### 4️⃣ Configurar Frontend

```bash
cd ../front

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
# Frontend rodando em http://localhost:5173
```

### 5️⃣ Acessar Sistema

Abra o navegador em: **http://localhost:5173**

**Credenciais de Teste:**
- **Admin:** `admin@sagafoodtruck.com` / `123456`
- **Atendente:** `atendente@sagafoodtruck.com` / `123456`

---

## 🗄️ Estrutura do Banco

### Tabelas Principais (7)

| Tabela | Descrição | Campos Principais |
|--------|-----------|-------------------|
| **employees** | Funcionários do sistema | id, name, email, password, role |
| **customers** | Clientes cadastrados | id, name, phone, email |
| **products** | Cardápio de produtos | id, name, price, stock, category |
| **orders** | Cabeçalho dos pedidos | id, customer, total, status, paymentMethod |
| **order_items** | Itens de cada pedido | id, orderId, productId, quantity, price |
| **product_audit** | Log de alterações em produtos | id, productId, action, oldData, newData |
| **order_audit** | Log de alterações em pedidos | id, orderId, action, oldData, newData |

### ENUMs (6)

- **order_status_type:** `Aguardando Pagamento`, `Preparando`, `Pronto`, `Entregue`, `Cancelado`
- **payment_status_type:** `Pendente`, `Pago`, `Cancelado`
- **payment_method_type:** `Pix`, `Cartão Crédito`, `Cartão Débito`, `Dinheiro`
- **product_status_type:** `Disponível`, `Estoque Baixo`, `Sem Estoque`, `Em Estoque`
- **product_category_type:** `Lanches`, `Acompanhamentos`, `Bebidas`, `Outros`
- **user_role_type:** `admin`, `atendente`

### Triggers Automáticos (5)

1. **update_timestamp** - Atualiza `updatedAt` em qualquer UPDATE
2. **calculate_product_status** - Calcula status baseado no estoque
3. **audit_order_changes** - Registra todas alterações em pedidos
4. **audit_product_changes** - Registra todas alterações em produtos
5. **calculate_item_subtotal** - Calcula subtotal (quantity × price)

### Views (3)

1. **vw_orders_complete** - Pedidos com itens agregados (json_agg)
2. **vw_products_low_stock** - Produtos abaixo do estoque mínimo
3. **vw_daily_stats** - Estatísticas diárias (vendas, pedidos)

---

## 🔌 API Endpoints

### Autenticação
```http
POST /api/auth/login
Body: { "email": "admin@sagafoodtruck.com", "password": "123456" }
Response: { "token": "...", "user": {...} }
```

### Produtos
```http
GET    /api/products          # Listar todos
GET    /api/products/:id      # Buscar por ID
POST   /api/products          # Criar novo
PUT    /api/products/:id      # Atualizar
DELETE /api/products/:id      # Remover (soft delete)
```

**Exemplo POST /api/products:**
```json
{
  "name": "Hambúrguer Artesanal",
  "description": "Hambúrguer 180g com queijo cheddar",
  "price": 25.00,
  "stock": 15,
  "minimumStock": 5,
  "category": "Lanches"
}
```

### Pedidos
```http
GET    /api/orders           # Listar todos
GET    /api/orders/:id       # Buscar por ID
POST   /api/orders           # Criar novo
PUT    /api/orders/:id       # Atualizar
DELETE /api/orders/:id       # Remover (hard delete)
```

**Exemplo POST /api/orders:**
```json
{
  "customer": "João Silva",
  "items": [
    { "productId": 1, "name": "Hambúrguer", "quantity": 2, "price": 25.00 },
    { "productId": 3, "name": "Batata Frita", "quantity": 1, "price": 12.00 }
  ],
  "paymentMethod": "Pix",
  "paymentStatus": "Pago",
  "notes": "Sem cebola"
}
```

---

## 📸 Estrutura do Projeto

```
saga_food_truck/
├── back/                      # Backend Node.js + Express
│   ├── config/
│   │   └── database.js        # Pool de conexões PostgreSQL
│   ├── controllers/
│   │   └── authController.js  # Lógica de autenticação
│   ├── routes/
│   │   ├── authRoutes.js      # Rotas de login
│   │   ├── products.js        # CRUD de produtos
│   │   └── orders.js          # CRUD de pedidos
│   ├── .env                   # Variáveis de ambiente
│   ├── server.js              # Servidor Express
│   └── package.json
│
├── front/                     # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductModal/  # Modal de produtos
│   │   │   ├── Sidebar/       # Menu lateral
│   │   │   └── ConfirmDialog/ # Diálogo de confirmação
│   │   ├── pages/
│   │   │   ├── Login/         # Tela de login
│   │   │   ├── Dashboard/     # Dashboard principal
│   │   │   ├── Products/      # Gerenciamento de produtos
│   │   │   └── Orders/        # Gerenciamento de pedidos
│   │   ├── store/
│   │   │   ├── slices/        # Redux slices
│   │   │   └── store.js       # Store Redux
│   │   ├── config/
│   │   │   └── api.js         # Configuração de requisições
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── docker-compose.yml         # Docker Compose (PostgreSQL)
├── init.sql                   # Script de inicialização do banco
└── README.md
```

---

## 📚 Documentação Adicional

- **[RELATORIO_INTEGRACAO.md](./RELATORIO_INTEGRACAO.md)** - Relatório completo de integração (750+ linhas)
- **[COMPARACAO_FRONTEND_SQL.md](./COMPARACAO_FRONTEND_SQL.md)** - Análise de compatibilidade
- **[MUDANCAS_SQL.md](./MUDANCAS_SQL.md)** - Log de mudanças no schema
- **[back/INTEGRACAO_BACKEND.md](./back/INTEGRACAO_BACKEND.md)** - Guia de uso do backend

---

## 🧪 Testes

### Testar Conexão com Banco
```bash
cd back
npm run test:db
```

### Testar API com Navegador
Abra o arquivo `api-tester.html` no navegador para testar todos os endpoints visualmente.

### Verificar Logs do PostgreSQL
```bash
docker-compose logs db
```

---

## 🔧 Troubleshooting

### Backend não conecta ao PostgreSQL
```bash
# Verificar se container está rodando
docker ps

# Reiniciar container
docker-compose restart

# Ver logs de erro
docker-compose logs db
```

### Frontend não carrega dados
```bash
# Verificar se backend está rodando
curl http://localhost:3000/health

# Verificar console do navegador (F12)
# Confirmar URL da API em front/src/config/api.js
```

### Porta 3000 ou 5173 em uso
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 👥 Autores

- **Felipe** - Desenvolvimento Backend + Integração PostgreSQL
- **Gabriel Schlemper** - Frontend React + Redux

**Repositório:** https://github.com/gabschlemper/saga_food_truck

---

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

## 🎓 Projeto Acadêmico

**Disciplina:** Desenvolvimento de Sistemas Web  
**Instituição:** [Nome da Universidade]  
**Período:** 2025/2  
**Data de Entrega:** 30/11/2025

### Critérios de Avaliação
- ✅ **Solução Técnica (50%)** - Backend + Frontend + Banco integrados
- ⚠️ **Vídeo Demonstração (30%)** - Pendente
- ✅ **Repositório Git (20%)** - Commits organizados, documentação completa

**Nota Atual Estimada:** 70/100 (falta vídeo demonstração)
