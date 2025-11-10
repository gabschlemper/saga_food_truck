CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION pg_database_owner;

CREATE TYPE public.tipo_status AS ENUM (
    'pendente',
    'em preparaÃ§Ã£o',
    'pronto',
    'entregue'
);

CREATE TYPE public.tipo_pagamento AS ENUM (
    'dinheiro',
    'cartÃ£o',
    'pix'
);

CREATE TABLE public.auditoria_pedido (
    id SERIAL PRIMARY KEY,
    id_pedido INT,
    data_insercao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR
);

CREATE TABLE public.pedido (
    id_funcionario INT NOT NULL,
    nome VARCHAR,
    id_pedido INT NOT NULL,
    valor_pedido FLOAT,
    status public.tipo_status,
    forma_de_pagamento public.tipo_pagamento,
    CONSTRAINT pedido_pk PRIMARY KEY (id_funcionario, id_pedido)
);

CREATE OR REPLACE FUNCTION public.registrar_auditoria_pedido()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria_pedido (id_pedido, acao)
        VALUES (NEW.id_pedido, 'INSERT');
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO auditoria_pedido (id_pedido, acao)
        VALUES (NEW.id_pedido, 'UPDATE');
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria_pedido (id_pedido, acao)
        VALUES (OLD.id_pedido, 'DELETE');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_insert_pedido
AFTER INSERT ON public.pedido
FOR EACH ROW
EXECUTE FUNCTION public.registrar_auditoria_pedido();

CREATE TRIGGER trigger_update_pedido
AFTER UPDATE ON public.pedido
FOR EACH ROW
EXECUTE FUNCTION public.registrar_auditoria_pedido();

CREATE TRIGGER trigger_delete_pedido
AFTER DELETE ON public.pedido
FOR EACH ROW
EXECUTE FUNCTION public.registrar_auditoria_pedido();
