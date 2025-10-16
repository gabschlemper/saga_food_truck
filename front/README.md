# saga_food_truck

Aplicação completa com frontend (React/Vite) e backend (Node.js/Express).

## Como rodar o projeto completo

### Pré-requisitos
- Node.js (versão 20.x ou superior)
- npm (versão 10.x ou superior)

## Como rodar o backend

1. Navegue até a pasta do backend:
```bash
cd back
```

2. Copie o arquivo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor:
```bash
npm run dev
```

5. O backend estará rodando em: `http://localhost:3000`

## Como rodar o frontend

### Configuração do ambiente

1. Navegue até a pasta do frontend:
```bash
cd front
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Ajuste a URL da API no arquivo `.env` se necessário (padrão: `http://localhost:3000`)

### Passos para rodar localmente

1. Instale as dependências (caso ainda não tenha instalado):
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação em seu navegador:
```
http://localhost:5173
```

### Configuração da API

O frontend está configurado para usar variáveis de ambiente do Vite:

- `VITE_API_BASE_URL` - URL base da API (padrão: http://localhost:3000)

### Como usar a API no código

```javascript
import { apiRequest } from './config/api.js';

// Exemplo de uso
const data = await apiRequest('/api/test');
```

### Scripts disponíveis

#### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter ESLint

#### Backend
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento

### Como testar a comunicação Frontend ↔ Backend

1. **Inicie o backend primeiro:**
```bash
cd back
npm run dev
```

2. **Em outro terminal, inicie o frontend:**
```bash
cd front
npm run dev
```

3. **Acesse http://localhost:5173 e clique nos botões de teste:**
   - "Testar API Root" - testa o endpoint `/`
   - "Testar API Test" - testa o endpoint `/api/test`

4. **Você verá:**
   - ✅ Mensagem verde com a resposta da API (se funcionando)
   - ❌ Mensagem vermelha com erro (se backend estiver offline)
   - 🔄 Loading enquanto a requisição acontece

5. **No terminal do backend você verá:**
   - Logs das requisições sendo feitas
   - Emojis indicando qual rota foi acessada

## Troubleshooting

### Button hover effects showing white instead of expected color

1. **Check for global CSS conflicts:**
```bash
# Search for button hover styles in your CSS files
grep -r "button:hover" src/
grep -r "btn.*:hover" src/
```

2. **Use browser dev tools:**
   - Right-click the button and select "Inspect"
   - Check the "Styles" tab to see which CSS rules are being applied
   - Look for crossed-out styles (overridden rules)

3. **Common causes:**
   - Global button styles in `index.css` or `App.css`
   - CSS framework overrides (Bootstrap, Tailwind, etc.)
   - Component library styles