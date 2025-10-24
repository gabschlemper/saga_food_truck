# Saga Food Truck - Backend

Backend da aplicação Saga Food Truck construído com Node.js e Express.

## Estrutura do projeto

- `server.js` - Servidor principal Express
- `.gitignore` - Arquivos ignorados pelo Git (node_modules, logs, etc.)
- `package.json` - Dependências e scripts do projeto
- `.env.example` - Exemplo de variáveis de ambiente
- `.env` - Variáveis de ambiente (não commitado)

## Como rodar o backend

### Pré-requisitos
- Node.js (versão 20.x ou superior)
- npm (versão 10.x ou superior)

### Passos para rodar localmente

1. Navegue até a pasta do backend:
```bash
cd back
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a API em seu navegador ou ferramenta de teste:
```
http://localhost:3000
```

### Configuração do ambiente

O backend usa as seguintes variáveis de ambiente:

- `PORT` - Porta do servidor (padrão: 3000)

Ajuste o arquivo `.env` conforme necessário.

### Endpoints disponíveis

- `GET /` - Endpoint raiz da API
- `GET /api/test` - Endpoint de teste

### Scripts disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)

### O que você verá no terminal

Quando o servidor iniciar, você verá mensagens como:
- Informações sobre o servidor rodando
- Logs quando as rotas forem acessadas
- Status das requisições
