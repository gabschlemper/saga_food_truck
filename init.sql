-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public."status";

CREATE TYPE public."status" AS ENUM (
	'pronto',
	'em preparação',
	'não montado');

-- DROP TYPE public."tipo_pagamento";

CREATE TYPE public."tipo_pagamento" AS ENUM (
	'cartão',
	'dinheiro',
	'pix');

-- DROP TYPE public."tipo_status";

CREATE TYPE public."tipo_status" AS ENUM (
	'pronto',
	'em preparação',
	'não montado');

-- DROP SEQUENCE public.auditoria_pedido_id_seq;

CREATE SEQUENCE public.auditoria_pedido_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.auditoria_pedido definição

-- Drop table

-- DROP TABLE public.auditoria_pedido;

CREATE TABLE public.auditoria_pedido (
	id serial4 NOT NULL,
	id_pedido int4 NULL,
	data_insercao timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	acao varchar NULL,
	CONSTRAINT auditoria_pedido_pkey PRIMARY KEY (id)
);


-- public.cliente definição

-- Drop table

-- DROP TABLE public.cliente;

CREATE TABLE public.cliente (
	id int4 NOT NULL,
	nome varchar NULL,
	telefone int4 NULL,
	cartao_de_credito_debito int4 NULL,
	fk_pedido_id_pedido int4 NULL,
	CONSTRAINT cliente_pkey PRIMARY KEY (id)
);


-- public.item definição

-- Drop table

-- DROP TABLE public.item;

CREATE TABLE public.item (
	nome varchar NULL,
	quantidade int4 NULL,
	preco_unitario float8 NULL,
	observacao varchar NULL,
	id_produto int4 NOT NULL,
	CONSTRAINT item_pkey PRIMARY KEY (id_produto)
);


-- public.pedido definição

-- Drop table

-- DROP TABLE public.pedido;

CREATE TABLE public.pedido (
	id_funcionario int4 NOT NULL,
	nome varchar NULL,
	id_pedido int4 NOT NULL,
	valor_pedido float8 NULL,
	"status" public."tipo_status" NULL,
	forma_de_pagamento public."tipo_pagamento" NULL,
	CONSTRAINT newtable_pkey PRIMARY KEY (id_funcionario, id_pedido)
);

-- Table Triggers

create trigger registrar_auditoria_pedido after
insert
    on
    public.pedido for each row execute function registrar_auditoria_pedido();
create trigger auditoria_delete after
delete
    on
    public.pedido for each row execute function registrar_auditoria_pedido();
create trigger update_auditoria_pedido after
update
    on
    public.pedido for each row execute function registrar_auditoria_pedido();


-- public.produto definição

-- Drop table

-- DROP TABLE public.produto;

CREATE TABLE public.produto (
	id_produto int4 NOT NULL,
	nome varchar NULL,
	descricao varchar NULL,
	preco float8 NULL,
	disponivel bool NULL,
	tempo_de_preparo float8 NULL,
	CONSTRAINT produto_pkey PRIMARY KEY (id_produto)
);


-- public.supervisor definição

-- Drop table

-- DROP TABLE public.supervisor;

CREATE TABLE public.supervisor (
	id_supervisor int4 NOT NULL,
	nome varchar NULL,
	cpf int4 NULL,
	telefone int4 NULL,
	e_mail varchar NULL,
	fk_atendente_pedido_id_funcionario int4 NULL,
	fk_atendente_pedido_id_pedido int4 NULL,
	fk_item_id_produto int4 NULL,
	CONSTRAINT supervisor_pkey PRIMARY KEY (id_supervisor)
);


-- public.vw_auditoria_pedido fonte

CREATE OR REPLACE VIEW public.vw_auditoria_pedido
AS SELECT id_pedido,
    acao,
    data_insercao
   FROM auditoria_pedido
  ORDER BY data_insercao DESC;



-- DROP FUNCTION public.registrar_auditoria_pedido();

CREATE OR REPLACE FUNCTION public.registrar_auditoria_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO auditoria_pedido (id_pedido, acao)
  VALUES (NEW.id_pedido, 'INSERT');
  RETURN NEW;
END;
$function$
;