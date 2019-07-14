var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //   connection.end();
});

var manager = inquirer
  .prompt({
    name: "execute",
    type: "rawlist",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]
  })
  .then(function(answer) {
    console.log(answer.execute);
    if (answer.execute === "View Products for Sale") {
      viewProducts();
    }
    if (answer.execute === "View Low Inventory") {
      viewLowInventory();
    }
    if (answer.execute === "Add to Inventory") {
      addToInventory();
    }
    if (answer.execute === "Add New Product") {
      addNewProduct();
    }
  });

var viewProducts = function viewProd() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("");
    console.log("WELCOME to Store");
    console.log("");

    var data = res;
    var table = new Table();
    data.forEach(function(product) {
      table.cell("Product id", product.id);
      table.cell("Product name", product.product_name);
      table.cell("Department name", product.department_name);
      table.cell("Price", product.price);
      table.cell("Total in stock", product.stock_quantity);
      table.newRow();
    });
    console.log(table.toString());
  });
};

var addToInventory = function viewProd() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("");
    console.log("WELCOME to Store");
    console.log("");

    var data = res;
    var table = new Table();
    data.forEach(function(product) {
      table.cell("Product id", product.id);
      table.cell("Product name", product.product_name);
      table.cell("Department name", product.department_name);
      table.cell("Price", product.price);
      table.cell("Total in stock", product.stock_quantity);
      table.newRow();
    });
    console.log(table.toString());
    addInvetory();
  });
  let addInvetory = function() {
    inquirer
      .prompt({
        name: "id",
        type: "input",
        message: "Take id of product quantity of which you want to change"
      })
      .then(function(answer) {
        let selected = answer.id;
        console.log(selected);
        connection.query(
          "SELECT * FROM products WHERE id=?",
          selected,
          function(err, res) {
            if (err) throw err;
            else {
              inquirer
                .prompt({
                  name: "quantity",
                  type: "input",
                  message: "What is quantity that you want to add?"
                })
                .then(function(answer2) {
                  let quantity = answer2.quantity;
                  connection.query(
                    "UPDATE products SET stock_quantity = " +
                      quantity +
                      "+"+
                      res[0].stock_quantity +
                      " WHERE id = " +
                      res[0].id +
                      ";",
                    //   update products
                    //     set quantity = quantity + 3
                    function(err, resUpdated) {
                      if (err) throw err;
                      console.log(
                        `${quantity} of ${
                          res[0].product_name
                        } was successfuly added!`
                      );
                    }
                  );
                });
            }
          }
        );
      });
  };
};
var viewLowInventory = function viewLowInv() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("");
    console.log("WELCOME to Store");
    console.log("");

    var data = res;

    var table = new Table();

    data.forEach(function(product) {
      if (product.stock_quantity < 5) {
        table.cell("Product id", product.id);
        table.cell("Product name", product.product_name);
        table.cell("Department name", product.department_name);
        table.cell("Price", product.price);
        table.cell("Total in stock", product.stock_quantity);
        table.newRow();
      }
    });
    console.log(table.toString());
  });
};

var addNewProduct = function addProduct() {
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message: "What is Product name"
      },
      {
        name: "departementName",
        type: "input",
        message: "In what departaments its gonna be located?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the product price?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many you will put in stock?"
        // validate: function(value){
        //     if(isNaN(value)==false){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.productName,
          department_name: answer.departementName,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err, res) {
          console.log("your item was succesfully added");
        }
      );
    });
};
