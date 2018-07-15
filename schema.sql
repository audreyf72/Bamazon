DROP DATABASE bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2),
stock_quantity INTEGER (10),
primary key(item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(1001, "Kids Lunchbox", "School Supplies", 19.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Self-Cooling Laptop Case", "Computer Accessories", 32.99, 150),
("RayBan Sunglasses", "Fashion Accessories", 29.99, 250),
("Ladies Wedge Sandal", "Women's Shoes", 49.99, 50),
("Mens Board Shorts", "Mens Fashion", 59.99, 45),
("Deluxe Dog Bed", "Pet Supplies", 35.99, 30),
("Robot Vacuum", "Kitchen and Home", 49.99, 50),
("Automated Shoe Rack", "Kitchen and Home", 169.99, 25),
("90 inch OLED Smart TV", "Electronics", 4999.98, 20),
("Bluetooth Earbuds", "Electronics", 49.99, 50);

USE bamazon_db;

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    overhead DECIMAL(10,2) NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id));

INSERT INTO departments (department_name, overhead, total_sales)
VALUES ("Kitchen and Home", 50000.00, 100.00),
    ("Computer Accessories", 20000.00, 200.00),
    ("Fashion Accessories", 30000.00, 58.98),
    ("School Supplies", 3000.00, 300.00),
    ("Women's Shoes", 1200.00, 400.00),
    ("Mens Fashion", 40000.00, 800.00),
    ("Pet Supplies", 35000.00, 100.00),
    ("Electronics", 82000.00, 12000.00);
    
SELECT * FROM products;