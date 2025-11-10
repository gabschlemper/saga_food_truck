# Usa a imagem oficial do PostgreSQL
FROM postgres:15

# Define variáveis de ambiente padrão (pode sobrescrever via docker-compose ou .env)
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=usuario
ENV POSTGRES_PASSWORD=usuario123

# Copia o script de inicialização para o diretório que o PostgreSQL executa automaticamente
COPY init.sql /docker-entrypoint-initdb.d/