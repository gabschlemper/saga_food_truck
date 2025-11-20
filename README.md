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
 
## 📞 Próximos Passos
 
1. ✅ Aplicar o novo banco de dados
2. ⚠️ Atualizar rotas do backend para usar as novas tabelas
3. ⚠️ Testar integração front-end + back-end + banco
4. ⚠️ Implementar hash de senha (bcrypt)
5. ⚠️ Adicionar mais validações no backend
6. ⚠️ Criar endpoints para dashboard (estatísticas)
7. ⚠️ Implementar autenticação JWT adequada



