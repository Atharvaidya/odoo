USE stockmaster;

INSERT INTO users (username, password, email, role)
VALUES 
('admin', 'admin123', 'admin@mail.com', 'manager'),
('staff1', 'pass123', 'staff@mail.com', 'staff');

INSERT INTO categories (name)
VALUES ('Steel'), ('Furniture'), ('Electronics');

INSERT INTO warehouses (name)
VALUES ('Main Warehouse'), ('Production Rack'), ('Warehouse 2');

INSERT INTO products (name, sku, category_id, uom, reorder_level)
VALUES 
('Steel Rod 10mm', 'SR10', 1, 'kg', 20),
('Wooden Chair', 'WC01', 2, 'pcs', 5);

INSERT INTO stock_levels (product_id, warehouse_id, quantity)
VALUES
(1, 1, 100),
(1, 2, 40),
(2, 1, 20);
