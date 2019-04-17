CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	ItemId INTEGER NOT NULL AUTO_INCREMENT,
    ProductName VARCHAR(100),
    DepartmentName VARCHAR(100),
    Price INTEGER NOT NULL,
    StockQuantity INTEGER NOT NULL,
    PRIMARY KEY (ItemId)
);