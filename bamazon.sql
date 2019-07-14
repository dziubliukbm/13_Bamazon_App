DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER(11) AUTO_INCREMENT NOT NULL,	
product_name VARCHAR(30),
department_name VARCHAR(30),
price INTEGER(10),
stock_quantity INTEGER(10),
PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iphone s6", "tech-department", 100, 79), ("MacbookPro","tech-department", 1700, 98),
("computer glasses", "warehouse", 20, 2000), ("pen", "warehouse", 2, 1000), 
("notepad", "warehouse", 4, 4), ("tablet", "new-warehouse", 300, 45), 
("bananas", "freezer", 5, 2), ("donuts", "bakery", 1, 3000), 
("Power bank", "warehouse", 13, 453), ("lights", "new-warehouse", 4, 43);

SELECT * FROM products;

UPDATE products
SET stock_quantity = 20
WHERE CustomerID = 1;