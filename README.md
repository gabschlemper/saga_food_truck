# Guia de Migração do Banco de Dados - SAGA Food Truck
 
## 🔄 Comparação: Banco Antigo vs Banco Novo
 
### ❌ BANCO ANTIGO (`init.sql`)
 
```sql
-- Apenas 2 tabelas:
1. pedido (estrutura incorreta)
2. auditoria_pedido (básica)
 
-- Problemas:
- Falta tabela de produtos
- Falta tabela de funcionários
- Falta tabela de itens do pedido
- Chave primária composta errada
- ENUMs com caracteres mal codificados
- Status não correspondem ao front-end
```
 
### ✅ BANCO NOVO (`init_corrected.sql`)
 
```sql
-- 7 tabelas principais:
1. funcionarios (usuários do sistema)
2. clientes (clientes do food truck)
3. produtos (cardápio)
4. pedidos (cabeçalho dos pedidos)
5. itens_pedido (itens de cada pedido)
6. auditoria_pedidos (log completo)
7. auditoria_produtos (log de produtos)
 
-- Melhorias:
✅ Estrutura normalizada (3FN)
✅ ENUMs corretos conforme front-end
✅ Relacionamentos corretos (FK)
✅ Triggers automáticos (status, timestamp, auditoria)
✅ Views úteis para relatórios
✅ Dados iniciais (seed)
✅ Índices para performance
✅ Constraints de validação
```
 
---
 
## 📋 Estrutura Detalhada das Tabelas
 
### 1. **funcionarios**
```
- id (PK)
- nome
- email (UNIQUE)
- senha
- role ('admin' ou 'atendente')
- ativo
- criado_em
- atualizado_em
```
 
### 2. **clientes**
```
- id (PK)
- nome
- telefone
- email
- criado_em
- atualizado_em
```
 
### 3. **produtos**
```
- id (PK)
- nome
- descricao
- preco
- estoque
- estoque_minimo
- status (calculado automaticamente)
- categoria
- ativo
- criado_em
- atualizado_em
```
 
### 4. **pedidos**
```
- id (PK)
- id_funcionario (FK)
- id_cliente (FK, nullable)
- nome_cliente
- valor_total
- forma_pagamento
- status_pagamento
- status
- observacoes
- criado_em
- atualizado_em
```
 
### 5. **itens_pedido**
```
- id (PK)
- id_pedido (FK)
- id_produto (FK)
- nome_produto (snapshot do nome)
- quantidade
- preco_unitario (snapshot do preço)
- subtotal (calculado automaticamente)
- criado_em
```
 
---
 
## 🚀 Como Aplicar a Migração
 
### Opção 1: Banco de Dados Novo (Recomendado)
 
```bash
# 1. Conectar ao PostgreSQL
psql -U postgres
 
# 2. Criar novo banco
CREATE DATABASE saga_food_truck_new;
\c saga_food_truck_new
 
# 3. Executar o script corrigido
\i init_corrected.sql
 
# 4. Verificar tabelas
\dt
```
 
### Opção 2: Substituir Banco Existente (⚠️ PERDA DE DADOS)
 
```bash
# 1. Conectar ao PostgreSQL
psql -U postgres
 
# 2. Dropar banco antigo
DROP DATABASE IF EXISTS saga_food_truck;
 
# 3. Criar novo
CREATE DATABASE saga_food_truck;
\c saga_food_truck
 
# 4. Executar script
\i init_corrected.sql
```
 
### Opção 3: Via Docker (Se estiver usando docker-compose)
 
```bash
# 1. Parar containers
docker-compose down -v
 
# 2. Substituir o arquivo init.sql pelo init_corrected.sql
# Ou renomear:
mv init.sql init_old.sql
mv init_corrected.sql init.sql
 
# 3. Subir novamente
docker-compose up -d
 
# 4. Verificar logs
docker-compose logs db
```
 
---
 
## 🔧 Atualização do Backend
 
### Arquivos que PRECISAM ser atualizados:
 
#### 1. **back/routes/products.js**
- Já está compatível ✅
- Pode precisar ajustar nomes de campos:
  - `stock` → `estoque`
  - `minimumStock` → `estoque_minimo`
  - `createdAt` → `criado_em`
  - `updatedAt` → `atualizado_em`
 
#### 2. **back/routes/orders.js**
- Adicionar campos:
  - `id_funcionario`
  - Relacionar com `itens_pedido`
- Ajustar campos:
  - `customer` → `nome_cliente`
  - `paymentMethod` → `forma_pagamento`
  - `paymentStatus` → `status_pagamento`
 
#### 3. **back/controllers/authController.js**
- Integrar com tabela `funcionarios`
- Usar hash de senha (bcrypt)
- Verificar role no banco
 
---
 
## 📊 ENUMs Utilizados
 
### Status do Pedido
```sql
'Aguardando Pagamento'
'Preparando'
'Pronto'
'Entregue'
'Cancelado'
```
 
### Status de Pagamento
```sql
'Pendente'
'Pago'
'Cancelado'
```
 
### Forma de Pagamento
```sql
'Pix'
'Cartão Crédito'
'Cartão Débito'
'Dinheiro'
```
 
### Status do Produto (Automático)
```sql
'Disponível'
'Estoque Baixo'
'Sem Estoque'
'Em Estoque'
```
 
### Categoria do Produto
```sql
'Lanches'
'Acompanhamentos'
'Bebidas'
'Outros'
```
 
### Role do Funcionário
```sql
'admin'
'atendente'
```
 
---
 
## 🎯 Funcionalidades Automáticas (Triggers)
 
### 1. **Atualização de Timestamp**
```sql
-- Campos criado_em e atualizado_em são atualizados automaticamente
```
 
### 2. **Cálculo de Status do Produto**
```sql
-- O status é calculado automaticamente baseado em:
-- estoque = 0 → 'Sem Estoque'
-- estoque <= estoque_minimo → 'Estoque Baixo'
-- estoque > estoque_minimo → 'Em Estoque'
```
 
### 3. **Cálculo de Subtotal**
```sql
-- subtotal = quantidade * preco_unitario (automático)
```
 
### 4. **Auditoria de Pedidos**
```sql
-- Toda operação (INSERT, UPDATE, DELETE) é registrada automaticamente
-- com dados antes e depois da alteração
```
 
---
 
## 📈 Views Disponíveis
 
### 1. **vw_pedidos_completos**
Retorna pedidos com todos os detalhes e itens em formato JSON
 
### 2. **vw_produtos_estoque_baixo**
Lista produtos que precisam reposição
 
### 3. **vw_estatisticas_dia**
Estatísticas diárias de vendas e pedidos
 
---
 
## 🧪 Testes Recomendados
 
```sql
-- 1. Verificar funcionários
SELECT * FROM funcionarios;
 
-- 2. Verificar produtos e status
SELECT nome, estoque, estoque_minimo, status FROM produtos;
 
-- 3. Verificar pedidos completos
SELECT * FROM vw_pedidos_completos;
 
-- 4. Verificar produtos com estoque baixo
SELECT * FROM vw_produtos_estoque_baixo;
 
-- 5. Verificar auditoria
SELECT * FROM auditoria_pedidos ORDER BY data_acao DESC LIMIT 10;
 
-- 6. Testar inserção de pedido
INSERT INTO pedidos (id_funcionario, nome_cliente, valor_total, forma_pagamento, status_pagamento, status)
VALUES (1, 'Teste Cliente', 25.50, 'Pix', 'Pago', 'Preparando');
```
 
---
 
## ⚠️ Observações Importantes
 
1. **Senhas**: No ambiente de produção, use bcrypt para hash de senhas
2. **Estoque**: Trigger de atualização de estoque está comentado - ative se necessário
3. **Performance**: Índices já estão criados nas colunas mais consultadas
4. **Auditoria**: Toda alteração em pedidos é registrada automaticamente
5. **Validações**: Constraints de CHECK garantem integridade dos dados
 
---
 
---

## 🔧 Processo de Integração Backend + PostgreSQL

### ✅ **O que foi implementado:**

#### 1. **Reestruturação Completa do Schema SQL**
- **Problema:** Nomenclatura em português não batia com frontend (camelCase em inglês)
- **Solução:** Refatoração completa de `init.sql` com 446 linhas
  - Tabelas: `funcionarios` → `employees`, `produtos` → `products`, `pedidos` → `orders`
  - Campos: `nome` → `name`, `estoque` → `stock`, `criado_em` → `createdAt`
  - Mantidos valores dos ENUMs em português para compatibilidade do frontend

#### 2. **Correção de Encoding UTF-8**
- **Problema:** Arquivo `init.sql` tinha BOM (Byte Order Mark) que causava erro no PostgreSQL:
  ```
  ERROR: invalid byte sequence for encoding "UTF8": 0xff
  ```
- **Solução:** Reescrita do arquivo sem BOM usando .NET Framework:
  ```powershell
  [System.IO.File]::WriteAllText("init.sql", (Get-Content "init.sql" -Raw), [System.Text.UTF8Encoding]::new($false))
  ```

#### 3. **Configuração do Pool de Conexões PostgreSQL**
- Criado `back/config/database.js` com:
  - Pool configurado (max 20 conexões, timeout 2s)
  - Event listeners para monitoramento
  - Função `testConnection()` para validação
  - Função helper `query()` com logging
  - **Problema resolvido:** Removido `process.exit(-1)` que matava servidor em caso de erro

#### 4. **Migração Completa da Rota Products**
- **Antes:** Mock data (array em memória)
- **Depois:** 100% integrado com PostgreSQL
  - `GET /api/products` - Lista todos produtos ativos
  - `GET /api/products/:id` - Busca produto específico
  - `POST /api/products` - Cria produto com validação de categoria
  - `PUT /api/products/:id` - Atualização parcial (dynamic query building)
  - `DELETE /api/products/:id` - Soft delete (active = false)
- Queries parametrizadas ($1, $2) para prevenir SQL injection
- Validação de categoria: ['Lanches', 'Acompanhamentos', 'Bebidas', 'Outros']

#### 5. **Configuração CORS para Desenvolvimento**
- **Problema:** Navegador bloqueava requisições do `file://` para `http://localhost`
- **Solução:** Liberado CORS para qualquer origem em desenvolvimento:
  ```javascript
  app.use(cors({ origin: true, credentials: true }))
  ```

#### 6. **Criação de Ferramentas de Teste**
- **Script `testDatabase.js`:** 5 testes automáticos
  1. Conexão básica com PostgreSQL
  2. Listagem de tabelas criadas
  3. Contagem e exibição de produtos
  4. Contagem de pedidos
  5. Listagem de funcionários
- **API Tester HTML:** Interface web para testar endpoints
  - Health Check
  - Listar Produtos / Produto por ID
  - Listar Pedidos
  - Criar Produto (POST)
  - Teste de conexão SQL

### ⚠️ **Problemas Identificados e Resolvidos:**

#### 1. **Container PostgreSQL com Credenciais Antigas**
```bash
# Problema: Container rodando há 4 semanas com senha diferente
# Solução:
docker stop focused_ganguly
docker rm focused_ganguly
docker-compose down -v
docker-compose up -d
```

#### 2. **Servidor Node.js Crashando Silenciosamente**
```javascript
// ❌ ANTES: Matava servidor em caso de erro
pool.on('error', (err) => {
  console.error('❌ Erro:', err);
  process.exit(-1);  // PROBLEMA!
});

// ✅ DEPOIS: Apenas loga erro
pool.on('error', (err) => {
  console.error('❌ Erro:', err);
  // Servidor continua rodando
});
```

#### 3. **Inicialização Assíncrona Bloqueando Servidor**
```javascript
// ❌ ANTES: IIFE sem tratamento de erro
(async () => {
  await testConnection();
})();

// ✅ DEPOIS: Promise com catch
testConnection().catch(err => {
  console.error('⚠️ Erro na conexão inicial:', err.message);
  // Servidor inicia mesmo se conexão falhar
});
```

#### 4. **PowerShell matando processos Node.js**
- **Problema:** `Invoke-RestMethod` do PowerShell 5.1 causava crash no Node.js
- **Solução:** Uso de navegador para testes ou API Tester HTML

### 📊 **Status Atual da Integração:**

| Componente | Status | Detalhes |
|------------|--------|----------|
| PostgreSQL 15 | ✅ 100% | Container rodando, 10 tabelas criadas |
| Conexão Pool | ✅ 100% | 20 conexões max, 2s timeout |
| Products CRUD | ✅ 100% | GET, POST, PUT, DELETE funcionando |
| Orders API | ⚠️ 50% | GET funcionando (mock data), POST pendente |
| Auth API | ❌ 0% | Rotas criadas, sem implementação JWT |
| Database Triggers | ✅ 100% | Status automático, timestamps, auditoria |
| CORS | ✅ 100% | Liberado para desenvolvimento |

### 🧪 **Testes Realizados e Aprovados:**

```bash
# Teste 1: Conexão PostgreSQL
npm run test:db
# ✅ Resultado: 8 produtos, 2 pedidos, 2 funcionários

# Teste 2: Listagem de Produtos
GET /api/products
# ✅ Resultado: 9 produtos retornados (8 seed + 1 criado via POST)

# Teste 3: Criação de Produto
POST /api/products
{
  "name": "Produto Teste",
  "description": "Criado via API Tester",
  "price": 15.00,
  "stock": 10,
  "minimumStock": 3,
  "category": "Outros"
}
# ✅ Resultado: Produto ID 9 criado com status "Em Estoque"

# Teste 4: Listagem de Pedidos (mock)
GET /api/orders
# ✅ Resultado: 2 pedidos retornados
```

### 🚀 **Scripts NPM Adicionados:**

```json
{
  "test:db": "node testDatabase.js",
  "db:ping": "node dbPing.js"
}
```

### 📁 **Arquivos Criados/Modificados:**

#### Novos Arquivos:
- `back/config/database.js` - Pool de conexões PostgreSQL
- `back/.env` - Variáveis de ambiente (DB_USER, DB_PASSWORD, etc.)
- `back/testDatabase.js` - Suite de testes automáticos
- `back/server-test.js` - Servidor minimalista para debugging
- `api-tester.html` - Interface web para testar APIs
- `back/INTEGRACAO_BACKEND.md` - Guia completo de uso

#### Arquivos Modificados:
- `init.sql` - Reestruturado para inglês/camelCase (446 linhas)
- `back/server.js` - Adicionado testConnection() e imports do database
- `back/routes/products.js` - Migrado de mock data para PostgreSQL (400+ linhas reescritas)
- `back/package.json` - Adicionados scripts test:db e db:ping

### 🔐 **Segurança Implementada:**

1. **Queries Parametrizadas:** Todas queries usam `$1, $2` para prevenir SQL injection
2. **Soft Delete:** Produtos não são deletados fisicamente (active = false)
3. **Validação de Entrada:** Categoria validada antes de INSERT/UPDATE
4. **Connection Pooling:** Previne esgotamento de conexões
5. **Error Handling:** Try/catch em todas rotas com mensagens apropriadas

---

## 📞 Próximos Passos
 
1. ✅ Aplicar o novo banco de dados
2. ✅ Configurar conexão PostgreSQL no backend
3. ✅ Migrar rota Products para SQL
4. ✅ Criar ferramentas de teste
5. ⚠️ Migrar rota Orders para SQL (incluir employeeId)
6. ⚠️ Atualizar frontend (adicionar campo category)
7. ⚠️ Implementar autenticação JWT
8. ⚠️ Implementar hash de senha (bcrypt)
9. ⚠️ Criar endpoints para dashboard (estatísticas)
10. ⚠️ Testes end-to-end com frontend + backend + PostgreSQL



