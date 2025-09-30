# 🚚 Saga Food Truck

Aplicação completa de food truck com frontend (React/Vite) e backend (Node.js/Express).

## 📋 Pré-requisitos

- **Node.js** (versão 18.x ou superior)
- **npm** (versão 8.x ou superior)
- **Docker Desktop** (para futuras funcionalidades de banco de dados)
- **Git** (para clonar o repositório)

## 🚀 Como rodar o projeto completo

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd saga_food_truck
```

### 2. Configurar o Backend

```bash
# Navegar para a pasta do backend
cd back

# Copiar arquivo de configuração
cp .env.example .env

# Instalar dependências
npm install

# Iniciar o servidor (em um terminal separado)
npm run dev
```

O backend estará rodando em: `http://localhost:3002`

### 3. Configurar o Frontend

```bash
# Navegar para a pasta do frontend (novo terminal)
cd front

# Copiar arquivo de configuração
cp .env.example .env

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### 4. Testar a aplicação

1. Acesse `http://localhost:5173` no navegador
2. Clique nos botões de teste para verificar a comunicação com a API
3. Verifique os logs no terminal do backend

## 📁 Estrutura do projeto

```
saga_food_truck/
├── back/                 # Backend (Node.js/Express)
│   ├── server.js        # Servidor principal
│   ├── package.json     # Dependências do backend
│   ├── .env.example     # Variáveis de ambiente (exemplo)
│   └── .env             # Variáveis de ambiente (local)
├── front/               # Frontend (React/Vite)
│   ├── src/            # Código fonte
│   ├── package.json    # Dependências do frontend
│   ├── .env.example    # Variáveis de ambiente (exemplo)
│   └── .env            # Variáveis de ambiente (local)
└── README.md           # Este arquivo
```

## ⚙️ Configurações

### Backend (.env)
```
PORT=3002
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

## 📜 Scripts disponíveis

### Backend
- `npm start` - Servidor em modo produção
- `npm run dev` - Servidor em modo desenvolvimento (nodemon)

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Linter ESLint

## 🔧 Problemas comuns

### Porta já em uso
**Erro:** `EADDRINUSE: address already in use :::3000`

**Soluções:**
```bash
# Verificar o que está usando a porta
lsof -i :3000

# Matar o processo (substitua <PID> pelo número do processo)
kill -9 <PID>

# Ou alterar a porta no arquivo back/.env
PORT=3001
```

### Frontend não conecta com Backend
**Problema:** Botões de teste retornam erro

**Soluções:**
1. Verificar se o backend está rodando (`http://localhost:3000`)
2. Verificar se a URL no `front/.env` está correta
3. Verificar se as portas não estão sendo bloqueadas pelo firewall

### Dependências não instaladas
**Erro:** `Module not found`

**Solução:**
```bash
# No backend
cd back && npm install

# No frontend  
cd front && npm install
```

### Docker (futuro)
**Preparação para containers:**
```bash
# Verificar se Docker está rodando
docker --version
docker-compose --version
```

### Variáveis de ambiente não carregam
**Problema:** Servidor não lê configurações do .env

**Soluções:**
1. Verificar se o arquivo `.env` existe
2. Verificar se não há espaços extras nas variáveis
3. Reiniciar o servidor após alterar o .env

## 🧪 Como testar

1. **Backend isolado:**
   - Acesse `http://localhost:3000` no navegador
   - Deve retornar JSON com mensagem da API

2. **Frontend isolado:**
   - Acesse `http://localhost:5173`
   - Interface deve carregar sem erros

3. **Comunicação completa:**
   - Com ambos rodando, clique nos botões de teste
   - Deve ver respostas verdes da API
   - Logs devem aparecer no terminal do backend

## 📞 Suporte

Se encontrar problemas:
1. Verificar a seção "Problemas comuns" acima
2. Verificar se todas as dependências foram instaladas
3. Verificar se as portas não estão conflitando
4. Reiniciar ambos os servidores