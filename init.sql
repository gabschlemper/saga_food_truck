-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."enum_employee_role";

CREATE TYPE public."enum_employee_role" AS ENUM (
	'admin',
	'atendente');

-- DROP TYPE public."enum_orders_paymentMethod";

CREATE TYPE public."enum_orders_paymentMethod" AS ENUM (
	'Pix',
	'Cartão Crédito',
	'Cartão Débito',
	'Dinheiro');

-- DROP TYPE public."enum_orders_paymentStatus";

CREATE TYPE public."enum_orders_paymentStatus" AS ENUM (
	'Pendente',
	'Pago',
	'Cancelado');

-- DROP TYPE public."enum_orders_status";

CREATE TYPE public."enum_orders_status" AS ENUM (
	'Aguardando Pagamento',
	'Preparando',
	'Pronto',
	'Entregue',
	'Cancelado');

-- DROP TYPE public."enum_products_category";

CREATE TYPE public."enum_products_category" AS ENUM (
	'Lanches',
	'Acompanhamentos',
	'Bebidas',
	'Outros');

-- DROP TYPE public."enum_products_status";

CREATE TYPE public."enum_products_status" AS ENUM (
	'Disponível',
	'Estoque Baixo',
	'Sem Estoque',
	'Em Estoque');

-- DROP TYPE public."order_status_type";

CREATE TYPE public."order_status_type" AS ENUM (
	'Aguardando Pagamento',
	'Preparando',
	'Pronto',
	'Entregue',
	'Cancelado');

-- DROP TYPE public."payment_method_type";

CREATE TYPE public."payment_method_type" AS ENUM (
	'Pix',
	'Cartão Crédito',
	'Cartão Débito',
	'Dinheiro');

-- DROP TYPE public."payment_status_type";

CREATE TYPE public."payment_status_type" AS ENUM (
	'Pendente',
	'Pago',
	'Cancelado');

-- DROP TYPE public."product_category_type";

CREATE TYPE public."product_category_type" AS ENUM (
	'Lanches',
	'Acompanhamentos',
	'Bebidas',
	'Outros');

-- DROP TYPE public."product_status_type";

CREATE TYPE public."product_status_type" AS ENUM (
	'Disponível',
	'Estoque Baixo',
	'Sem Estoque',
	'Em Estoque');

-- DROP TYPE public."user_role_type";

CREATE TYPE public."user_role_type" AS ENUM (
	'admin',
	'atendente');

-- DROP SEQUENCE public.admin_id_seq;

CREATE SEQUENCE public.admin_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.admin_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.admin_id_seq TO usuario;

-- DROP SEQUENCE public.customer_id_seq;

CREATE SEQUENCE public.customer_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.customer_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.customer_id_seq TO usuario;

-- DROP SEQUENCE public.employee_id_seq;

CREATE SEQUENCE public.employee_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.employee_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.employee_id_seq TO usuario;

-- DROP SEQUENCE public.order_audit_id_seq;

CREATE SEQUENCE public.order_audit_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.order_audit_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.order_audit_id_seq TO usuario;

-- DROP SEQUENCE public.order_items_id_seq;

CREATE SEQUENCE public.order_items_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.order_items_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.order_items_id_seq TO usuario;

-- DROP SEQUENCE public.orders_id_seq;

CREATE SEQUENCE public.orders_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.orders_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.orders_id_seq TO usuario;

-- DROP SEQUENCE public.product_audit_id_seq;

CREATE SEQUENCE public.product_audit_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.product_audit_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.product_audit_id_seq TO usuario;

-- DROP SEQUENCE public.products_id_seq;

CREATE SEQUENCE public.products_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.products_id_seq OWNER TO usuario;
GRANT ALL ON SEQUENCE public.products_id_seq TO usuario;
-- public.customer definição

-- Drop table

-- DROP TABLE public.customer;

CREATE TABLE public.customer ( CONSTRAINT customer_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.customer OWNER TO usuario;
GRANT ALL ON TABLE public.customer TO usuario;


-- public.employee definição

-- Drop table

-- DROP TABLE public.employee;

CREATE TABLE public.employee ( id serial4 NOT NULL, "name" varchar(255) NOT NULL, email varchar(255) NOT NULL, "password" varchar(255) NOT NULL, "role" public."enum_employee_role" DEFAULT 'atendente'::enum_employee_role NULL, active bool DEFAULT true NULL, "createdAt" timestamptz NOT NULL, "updatedAt" timestamptz NOT NULL, CONSTRAINT employee_email_key UNIQUE (email), CONSTRAINT employee_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.employee OWNER TO usuario;
GRANT ALL ON TABLE public.employee TO usuario;


-- public.order_audit definição

-- Drop table

-- DROP TABLE public.order_audit;

CREATE TABLE public.order_audit ( id serial4 NOT NULL, "orderId" int4 NULL, "action" varchar(50) NOT NULL, "employeeId" int4 NULL, "previousData" jsonb NULL, "newData" jsonb NULL, "actionDate" timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT order_audit_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.order_audit OWNER TO usuario;
GRANT ALL ON TABLE public.order_audit TO usuario;


-- public.order_items definição

-- Drop table

-- DROP TABLE public.order_items;

CREATE TABLE public.order_items ( id serial4 NOT NULL, "orderId" int4 NOT NULL, "productId" int4 NOT NULL, "name" varchar(255) NOT NULL, quantity int4 NOT NULL, price numeric(10, 2) NOT NULL, subtotal numeric(10, 2) NOT NULL, "createdAt" timestamptz NULL, CONSTRAINT order_items_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.order_items OWNER TO usuario;
GRANT ALL ON TABLE public.order_items TO usuario;


-- public.orders definição

-- Drop table

-- DROP TABLE public.orders;

CREATE TABLE public.orders ( id serial4 NOT NULL, "employeeId" int4 NOT NULL, "customerId" int4 NULL, "customerName" varchar(255) NULL, total numeric(10, 2) NOT NULL, "paymentMethod" public."enum_orders_paymentMethod" NOT NULL, "paymentStatus" public."enum_orders_paymentStatus" DEFAULT 'Pendente'::"enum_orders_paymentStatus" NULL, status public."enum_orders_status" DEFAULT 'Aguardando Pagamento'::enum_orders_status NULL, notes text NULL, "createdAt" timestamptz NOT NULL, "updatedAt" timestamptz NOT NULL, CONSTRAINT orders_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.orders OWNER TO usuario;
GRANT ALL ON TABLE public.orders TO usuario;


-- public.product_audit definição

-- Drop table

-- DROP TABLE public.product_audit;

CREATE TABLE public.product_audit ( id serial4 NOT NULL, "productId" int4 NULL, "action" varchar(50) NOT NULL, "employeeId" int4 NULL, "fieldChanged" varchar(100) NULL, "previousValue" text NULL, "newValue" text NULL, "actionDate" timestamp DEFAULT CURRENT_TIMESTAMP NULL, CONSTRAINT product_audit_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.product_audit OWNER TO usuario;
GRANT ALL ON TABLE public.product_audit TO usuario;


-- public.products definição

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products ( id serial4 NOT NULL, "name" varchar(255) NOT NULL, description text NULL, price numeric(10, 2) NOT NULL, stock int4 DEFAULT 0 NULL, "minimumStock" int4 DEFAULT 0 NULL, status public."enum_products_status" DEFAULT 'Disponível'::enum_products_status NULL, category public."enum_products_category" DEFAULT 'Outros'::enum_products_category NULL, active bool DEFAULT true NULL, "createdAt" timestamptz NOT NULL, "updatedAt" timestamptz NOT NULL, CONSTRAINT products_pkey PRIMARY KEY (id));

-- Permissions

ALTER TABLE public.products OWNER TO usuario;
GRANT ALL ON TABLE public.products TO usuario;



-- DROP FUNCTION public.update_product_stock();

CREATE OR REPLACE FUNCTION public.update_product_stock()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE products
        SET stock = stock - NEW.quantity
        WHERE id = NEW."productId";
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE products
        SET stock = stock + OLD.quantity
        WHERE id = OLD."productId";
    END IF;
    RETURN NULL;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_product_stock() OWNER TO usuario;
GRANT ALL ON FUNCTION public.update_product_stock() TO usuario;


-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
 
-- ============================================
-- FUNCTIONS E TRIGGERS
-- ============================================
 
-- Função para atualizar o campo updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
-- Triggers para atualizar timestamp
CREATE TRIGGER trigger_update_employees
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
 
CREATE TRIGGER trigger_update_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
 
CREATE TRIGGER trigger_update_products
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
 
CREATE TRIGGER trigger_update_orders
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
 
-- Função para calcular status do produto baseado no estoque
CREATE OR REPLACE FUNCTION calculate_product_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN
        NEW.status = 'Sem Estoque';
    ELSIF NEW.stock <= NEW."minimumStock" THEN
        NEW.status = 'Estoque Baixo';
    ELSE
        NEW.status = 'Em Estoque';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
-- Trigger para calcular status do produto
CREATE TRIGGER trigger_calculate_product_status
    BEFORE INSERT OR UPDATE OF stock, "minimumStock" ON products
    FOR EACH ROW
    EXECUTE FUNCTION calculate_product_status();
 
-- Função para auditoria de pedidos
CREATE OR REPLACE FUNCTION audit_order()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO order_audit ("orderId", action, "newData")
        VALUES (NEW.id, 'INSERT', row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO order_audit ("orderId", action, "previousData", "newData")
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO order_audit ("orderId", action, "previousData")
        VALUES (OLD.id, 'DELETE', row_to_json(OLD)::jsonb);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
 
-- Triggers de auditoria para pedidos
CREATE TRIGGER trigger_audit_insert_order
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION audit_order();
 
CREATE TRIGGER trigger_audit_update_order
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION audit_order();
 
CREATE TRIGGER trigger_audit_delete_order
    AFTER DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION audit_order();
 
-- Função para calcular subtotal do item
CREATE OR REPLACE FUNCTION calculate_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal = NEW.quantity * NEW.price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
-- Trigger para calcular subtotal
CREATE TRIGGER trigger_calculate_subtotal
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_item_subtotal();
 
-- Função para atualizar estoque após adicionar item ao pedido
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE products
        SET stock = stock - NEW.quantity
        WHERE id = NEW."productId";
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE products
        SET stock = stock + OLD.quantity
        WHERE id = OLD."productId";
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
 
-- Trigger para atualizar estoque (comentado por segurança - ativar se necessário)
-- CREATE TRIGGER trigger_update_stock
--     AFTER INSERT OR DELETE ON order_items
--     FOR EACH ROW
--     EXECUTE FUNCTION update_product_stock();
 
-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================
 
-- Inserir funcionários (senhas devem ser hash em produção)
INSERT INTO employees (name, email, password, role) VALUES
    ('Admin Teste', 'admin@sagafoodtruck.com', '123456', 'admin'),
    ('Atendente Teste', 'atendente@sagafoodtruck.com', '123456', 'atendente');
 
-- Inserir produtos iniciais
INSERT INTO products (name, description, price, stock, "minimumStock", category) VALUES
    ('Hambúrguer Artesanal', 'Hambúrguer com carne 150g, queijo, alface e tomate', 18.50, 2, 5, 'Lanches'),
    ('Batata Frita', 'Porção de batata frita crocante (200g)', 8.00, 0, 3, 'Acompanhamentos'),
    ('Refrigerante Lata', 'Refrigerante em lata 350ml', 4.50, 1, 10, 'Bebidas'),
    ('Hot Dog Completo', 'Hot dog com salsicha, queijo e batata palha', 12.00, 8, 2, 'Lanches'),
    ('Suco Natural', 'Suco natural de frutas 300ml', 6.00, 15, 5, 'Bebidas'),
    ('Nuggets', 'Porção de nuggets de frango (8 unidades)', 10.00, 5, 3, 'Lanches'),
    ('Água Mineral', 'Água mineral 500ml', 2.50, 20, 10, 'Bebidas'),
    ('Onion Rings', 'Porção de anéis de cebola empanados', 9.00, 3, 2, 'Acompanhamentos');
 
-- Inserir clientes de exemplo
INSERT INTO customers (name, phone) VALUES
    ('João Silva', '(21) 98765-4321'),
    ('Maria Santos', '(21) 91234-5678'),
    ('Pedro Costa', '(21) 99876-5432');
 
-- Inserir pedidos de exemplo
INSERT INTO orders ("employeeId", "customerId", customer, total, "paymentMethod", "paymentStatus", status) VALUES
    (2, 1, 'João Silva', 26.50, 'Pix', 'Pago', 'Preparando'),
    (2, 2, 'Maria Santos', 12.00, 'Dinheiro', 'Pago', 'Pronto');
 
-- Inserir itens dos pedidos
INSERT INTO order_items ("orderId", "productId", name, quantity, price) VALUES
    (1, 1, 'Hambúrguer Artesanal', 1, 18.50),
    (1, 2, 'Batata Frita', 1, 8.00),
    (2, 4, 'Hot Dog Completo', 1, 12.00);
 
-- ============================================
-- VIEWS ÚTEIS
-- ============================================
 
-- View de pedidos com detalhes completos (compatível com frontend)
CREATE OR REPLACE VIEW vw_orders_complete AS
SELECT
    o.id,
    o.customer,
    e.name as "employeeName",
    o.total,
    o."paymentMethod",
    o."paymentStatus",
    o.status,
    o."createdAt",
    o."updatedAt",
    json_agg(
        json_build_object(
            'productId', oi."productId",
            'name', oi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.subtotal
        )
    ) as items
FROM orders o
LEFT JOIN employees e ON o."employeeId" = e.id
LEFT JOIN order_items oi ON o.id = oi."orderId"
GROUP BY o.id, o.customer, e.name, o.total,
         o."paymentMethod", o."paymentStatus", o.status,
         o."createdAt", o."updatedAt";
 
-- View de produtos com estoque baixo
CREATE OR REPLACE VIEW vw_products_low_stock AS
SELECT
    id,
    name,
    stock,
    "minimumStock",
    status,
    category
FROM products
WHERE stock <= "minimumStock" AND active = TRUE
ORDER BY stock ASC;
 
-- View de estatísticas do dia
CREATE OR REPLACE VIEW vw_daily_stats AS
SELECT
    DATE("createdAt") as date,
    COUNT(*) as "totalOrders",
    SUM(total) as "totalSales",
    AVG(total) as "averageTicket",
    COUNT(CASE WHEN status = 'Entregue' THEN 1 END) as "deliveredOrders",
    COUNT(CASE WHEN status = 'Cancelado' THEN 1 END) as "cancelledOrders"
FROM orders
GROUP BY DATE("createdAt")
ORDER BY date DESC;
 
-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
 
COMMENT ON TABLE employees IS 'Armazena os funcionários do sistema (admin e atendentes)';
COMMENT ON TABLE customers IS 'Armazena os clientes do food truck';
COMMENT ON TABLE products IS 'Armazena os produtos/itens do cardápio';
COMMENT ON TABLE orders IS 'Armazena os pedidos realizados';
COMMENT ON TABLE order_items IS 'Armazena os itens de cada pedido (relacionamento N:N)';
COMMENT ON TABLE order_audit IS 'Registro de auditoria de todas as operações nos pedidos';
COMMENT ON TABLE product_audit IS 'Registro de auditoria de alterações nos produtos';
 
-- ============================================
-- FIM DO SCRIPT
-- ============================================
 
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;