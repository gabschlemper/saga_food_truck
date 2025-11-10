-- public.cliente definição

CREATE TABLE public.cliente (
 ID INT PRIMARY KEY,
    Nome VARCHAR,
    e_mail VARCHAR,
    Telefone INT,
    Senha VARCHAR,
    Cartao_de_credito_Debito INT,
    fk_Pedido_Id_Pedido INT
);