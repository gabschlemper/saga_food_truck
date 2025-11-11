Aplicação de Food Truck Completa
Aplicação completa de food truck com frontend (React/Vite) e backend (Node.js/Express).

📋 Pré-requisitos

Node.js (versão 18.x ou superior)

npm (versão 8.x ou superior)

Docker Desktop (para futuras funcionalidades de banco de dados)

Git (para clonar o repositório)

🚀 Como rodar o projeto completo

1. Clonar o repositório
git clone <url-do-repositorio>
cd saga_food_truck

2. Configurar e Iniciar o Backend
O Backend deve ser iniciado em um terminal separado.

# Navegar para a pasta do backend
cd back

# Copiar arquivo de configuração
cp .env.example .env

# Instalar dependências
npm install

# Iniciar o servidor (em um terminal separado)
npm run dev
O backend estará rodando em: http://localhost:3002

3. Configurar e Iniciar o Frontend
O Frontend agora pode ser iniciado a partir da pasta raiz (saga_food_truck/) usando um único comando.

Primeira Configuração (apenas uma vez):

# Navegar para a pasta do frontend
cd front

# Copiar arquivo de configuração
cp .env.example .env

# Instalar dependências
npm install
Para iniciar o Frontend (em um NOVO terminal, a partir da pasta raiz saga_food_truck):

npm run start:fe
O frontend estará rodando em: http://localhost:5173

4. Testar a aplicação
Acesse http://localhost:5173 no navegador.

A Página Home (página principal) agora contém os botões de teste de API. Clique neles para verificar a comunicação com o Backend.

Verifique os logs no terminal do backend para confirmação.

📁 Estrutura do projeto

saga_food_truck/
├── back/                 # Backend (Node.js/Express)
│   ├── server.js        # Servidor principal
│   ├── package.json     # Dependências do backend
│   ├── .env.example     # Variáveis de ambiente (exemplo)
│   └── .env             # Variáveis de ambiente (local)
├── front/               # Frontend (React/Vite)
│   ├── src/            # Código fonte
│   ├── pages/          # Páginas (Home, Menu, etc.)
│   ├── package.json    # Dependências do frontend
│   ├── .env.example    # Variáveis de ambiente (exemplo)
│   └── .env            # Variáveis de ambiente (local)
└── README.md           # Este arquivo

⚙️ Configurações

Backend (.env)
PORT=3002
Frontend (.env)

VITE_API_BASE_URL=http://localhost:3002
(A URL deve apontar para a porta do backend, 3002)

📜 Scripts disponíveis

Geral (pasta raiz saga_food_truck)

Script	Descrição
npm run start:fe	NOVO! Inicia o Frontend (entra na pasta front e executa npm run dev).
Backend

Script	Descrição
npm start	Servidor em modo produção
npm run dev	Servidor em modo desenvolvimento (nodemon)
Frontend (use apenas se estiver dentro da pasta front)

Script	Descrição
npm run dev	Servidor de desenvolvimento
npm run build	Build de produção
npm run preview	Preview da build
npm run lint	Linter ESLint

🔧 Problemas comuns

Porta já em uso
Erro: EADDRINUSE: address already in use :::3000

Soluções:

# Verificar o que está usando a porta
lsof -i :3000
# Matar o processo (substitua <PID> pelo número do processo)
kill -9 <PID>
# Ou alterar a porta no arquivo back/.env
PORT=3001
Frontend não conecta com Backend

Problema: Botões de teste retornam erro

Soluções:

Verificar se o backend está rodando (http://localhost:3002)
Verificar se a URL no front/.env está correta (VITE_API_BASE_URL=http://localhost:3002)
Verificar se as portas não estão sendo bloqueadas pelo firewall
Dependências não instaladas

Erro: Module not found
Solução:

# No backend
cd back && npm install

# No frontend
cd front && npm install
Docker (futuro)

Preparação para containers:

# Verificar se Docker está rodando
docker --version
docker-compose --version
Variáveis de ambiente não carregadas