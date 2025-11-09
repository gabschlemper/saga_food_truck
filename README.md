# 📦 Auditoria de Pedidos com PostgreSQL e Docker

Este projeto implementa um sistema de auditoria para operações em uma tabela de pedidos, utilizando **PostgreSQL 18** em ambiente **Docker**. A estrutura inclui tipos personalizados, triggers automáticos e uma função de auditoria que registra ações de `INSERT`, `UPDATE` e `DELETE`.

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Docker instalado
- Git instalado

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pedido-auditoria.git
cd pedido-auditoria

# Suba o container
docker-compose up -d
```

> O banco será criado automaticamente com base no arquivo `init.sql`.

---

## 🧱 Estrutura do banco

### Tabelas

- `pedido`: tabela principal com campos como `id_pedido`, `status`, `forma_pagamento`, `data_criacao`
- `auditoria_pedido`: registra ações realizadas na tabela `pedido`

### Tipos ENUM

- `status`: `'pendente'`, `'em_preparacao'`, `'pronto'`, `'entregue'`
- `forma_pagamento`: `'dinheiro'`, `'cartao'`, `'pix'`

### Função de auditoria

```sql
registrar_autoria_pedido()
```

Registra o tipo de operação (`TG_OP`) e o `id_pedido` na tabela de auditoria.

### Triggers

- `AFTER INSERT`: `registrar_autoria_pedido`
- `AFTER UPDATE`: `autoria_update`
- `AFTER DELETE`: `autoria_delete`

---

## 🧪 Testes

Você pode testar os triggers executando comandos como:

```sql
INSERT INTO pedido (...) VALUES (...);
UPDATE pedido SET status = 'pronto' WHERE id_pedido = ...;
DELETE FROM pedido WHERE id_pedido = ...;
SELECT * FROM auditoria_pedido;
```

---

## 🛠 Conexão com DBeaver

- **Host**: `localhost`
- **Porta**: `5432`
- **Usuário**: `felipe`
- **Senha**: `minhaSenha123`
- **Banco**: `pedidos`

---

## 📁 Estrutura do projeto

```
pedido-auditoria/
├── docker-compose.yml
├── init.sql
├── README.md
```

---

## 📌 Observações

- O script `init.sql` é executado automaticamente apenas na **primeira vez** que o container é iniciado.
- Para forçar a reexecução do script, use:

```bash
docker-compose down -v
docker-compose up -d
```

---

Feito com 💻 por Felipe