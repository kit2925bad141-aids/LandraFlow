CREATE DATABASE IF NOT EXISTS laundry_management;
USE laundry_management;

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    cloth_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    UNIQUE KEY uq_service (cloth_type, service_type)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    order_status VARCHAR(30) NOT NULL DEFAULT 'Collected',
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    cloth_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

INSERT INTO services (cloth_type, service_type, price) VALUES
('Shirt','Washing',50),('Shirt','Ironing',25),('Shirt','Dry Cleaning',120),
('Pant','Washing',60),('Pant','Ironing',30),('Pant','Dry Cleaning',150),
('Saree','Washing',100),('Saree','Ironing',50),('Saree','Dry Cleaning',250),
('Bedsheet','Washing',120),('Bedsheet','Ironing',60),('Bedsheet','Dry Cleaning',300),
('Jacket','Washing',150),('Jacket','Ironing',70),('Jacket','Dry Cleaning',350)
ON DUPLICATE KEY UPDATE price=VALUES(price);
