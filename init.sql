-- ============================================
-- SAGA Food Truck - Database Schema
-- Database adaptado para compatibilidade com Frontend
-- Nomenclatura em inglês (camelCase) conforme usado no Front-End
-- ============================================
 
-- Limpar schema existente (CUIDADO: Remove todos os dados!)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION pg_database_owner;
 
-- ============================================
-- ENUMS (Tipos Customizados)
-- ============================================
 
-- Status do Pedido (conforme usado no front-end)
CREATE TYPE order_status_type AS ENUM (
    'Aguardando Pagamento',
    'Preparando',
    'Pronto',
    'Entregue',
    'Cancelado'
);
 
-- Status de Pagamento (conforme usado no front-end)
CREATE TYPE payment_status_type AS ENUM (
    'Pendente',
    'Pago',
    'Cancelado'
);
 
-- Forma de Pagamento (conforme usado no front-end)
CREATE TYPE payment_method_type AS ENUM (
    'Pix',
    'Cartão Crédito',
    'Cartão Débito',
    'Dinheiro'
);
 
-- Status do Produto (conforme usado no front-end)
CREATE TYPE product_status_type AS ENUM (
    'Disponível',
    'Estoque Baixo',
    'Sem Estoque',
    'Em Estoque'
);
 
-- Categoria do Produto
CREATE TYPE product_category_type AS ENUM (
    'Lanches',
    'Acompanhamentos',
    'Bebidas',
    'Outros'
);
 
-- Papel/Cargo do Funcionário
CREATE TYPE user_role_type AS ENUM (
    'admin',
    'atendente'
);
 
-- ============================================
-- TABELA: employees (funcionarios)
-- Armazena funcionários (admin e atendentes)
-- ============================================
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Em produção, usar hash (bcrypt)
    role user_role_type NOT NULL DEFAULT 'atendente',
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índices para melhor performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_role ON employees(role);

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Em produção, usar hash (bcrypt)
    role user_role_type NOT NULL DEFAULT 'admin',
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índices para melhor performance
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_admin_role ON admin(role);
 
 
-- ============================================
-- TABELA: customers (clientes)
-- Armazena dados dos clientes
-- ============================================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índice para busca por nome
CREATE INDEX idx_customers_name ON customers(name);
 
-- ============================================
-- TABELA: products (produtos)
-- Armazena itens do cardápio
-- ============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    "minimumStock" INTEGER NOT NULL DEFAULT 0 CHECK ("minimumStock" >= 0),
    status product_status_type NOT NULL DEFAULT 'Disponível',
    category product_category_type DEFAULT 'Outros',
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índices
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
 
-- ============================================
-- TABELA: orders (pedidos)
-- Armazena os pedidos realizados
-- ============================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    "employeeId" INTEGER NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    "customerId" INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    customer VARCHAR(255) NOT NULL, -- Nome do cliente (pode não estar cadastrado)
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    "paymentMethod" payment_method_type NOT NULL,
    "paymentStatus" payment_status_type NOT NULL DEFAULT 'Pendente',
    status order_status_type NOT NULL DEFAULT 'Aguardando Pagamento',
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índices
CREATE INDEX idx_orders_employee ON orders("employeeId");
CREATE INDEX idx_orders_customer ON orders("customerId");
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders("paymentStatus");
CREATE INDEX idx_orders_created ON orders("createdAt");
 
-- ============================================
-- TABELA: order_items (itens_pedido)
-- Relacionamento N:N entre pedidos e produtos
-- ============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL, -- Guardar nome no momento da venda
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índices
CREATE INDEX idx_order_items_order ON order_items("orderId");
CREATE INDEX idx_order_items_product ON order_items("productId");
 
-- ============================================
-- TABELA: order_audit (auditoria_pedidos)
-- Registro de alterações nos pedidos
-- ============================================
CREATE TABLE order_audit (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    "employeeId" INTEGER,
    "previousData" JSONB, -- Estado anterior do pedido (para UPDATE/DELETE)
    "newData" JSONB, -- Novo estado do pedido (para INSERT/UPDATE)
    "actionDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índice
CREATE INDEX idx_order_audit_order ON order_audit("orderId");
CREATE INDEX idx_order_audit_date ON order_audit("actionDate");
 
-- ============================================
-- TABELA: product_audit (auditoria_produtos)
-- Registro de alterações nos produtos
-- ============================================
CREATE TABLE product_audit (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER,
    action VARCHAR(50) NOT NULL,
    "employeeId" INTEGER,
    "fieldChanged" VARCHAR(100),
    "previousValue" TEXT,
    "newValue" TEXT,
    "actionDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Índice
CREATE INDEX idx_product_audit_product ON product_audit("productId");
 
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

