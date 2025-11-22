CREATE DATABASE IF NOT EXISTS stockmaster;
USE stockmaster;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role ENUM('manager','staff') DEFAULT 'staff'
);

-- CATEGORIES
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- PRODUCTS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INT,
    uom VARCHAR(50),
    reorder_level INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- WAREHOUSES
CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

-- STOCK LEVELS (product quantity per warehouse)
CREATE TABLE stock_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    quantity INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- RECEIPTS (incoming stock)
CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier VARCHAR(150),
    status ENUM('draft','waiting','ready','done','cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RECEIPT ITEMS
CREATE TABLE receipt_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- DELIVERIES (outgoing stock)
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(150),
    status ENUM('draft','waiting','ready','done','cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DELIVERY ITEMS
CREATE TABLE delivery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- INTERNAL TRANSFERS
CREATE TABLE internal_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_warehouse INT NOT NULL,
    dest_warehouse INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_warehouse) REFERENCES warehouses(id),
    FOREIGN KEY (dest_warehouse) REFERENCES warehouses(id)
);

-- TRANSFER ITEMS
CREATE TABLE transfer_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (transfer_id) REFERENCES internal_transfers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- STOCK LEDGER (history)
CREATE TABLE stock_ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity INT,
    source_location VARCHAR(150),
    dest_location VARCHAR(150),
    type ENUM('receipt','delivery','transfer','adjustment'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
