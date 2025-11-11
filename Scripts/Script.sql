-- public.cliente definição

CREATE TABLE public.cliente (
ID INT primary key,
Nome VARCHAR,
e_mail VARCHAR,
Telefone INT,
Senha VARCHAR,
Cartao_de_credito_Debito INT,
FK_Pedido_id_Pedido INT

);

