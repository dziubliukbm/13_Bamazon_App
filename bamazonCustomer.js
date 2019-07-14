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

var start = function afterConnection() {
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
    ask();
  });
};

var ask = function() {
  inquirer
    .prompt({
      name: "productToBuy",
      type: "input",
      message: "Chose the ID of product which you wonna buy?"
    })
    .then(function(answer) {
      var selected = answer.productToBuy;
      console.log(selected);
      connection.query("SELECT * FROM products WHERE Id=?", selected, function(
        err,
        res
      ) {
        if (err) throw err;
        if (res.length === 0) {
          console.log("not exist");
          ask();
        } else {
          inquirer
            .prompt({
              name: "quantity",
              type: "input",
              message: "How many items you would like to buy?"
            })
            .then(function(answer2) {
              var quantity = answer2.quantity;
              if (quantity > res[0].stock_quantity) {
                console.log(quantity);
                console.log("sorry, it's more then in stock");
              } else {
                console.log(res[0].product_name + " purchased");
                console.log(
                  "purchase quantity: " +
                    quantity +
                    "; price :" +
                    res[0].price +
                    "; totla: " +
                    quantity * res[0].price +
                    ";"
                );

                var avaliable = res[0].stock_quantity - quantity;

                connection.query(
                  "UPDATE products SET stock_quantity = " +
                    avaliable +
                    " WHERE id = " +
                    res[0].id +
                    ";",
                  // UPDATE products
                  // SET stock_quantity = 20
                  // WHERE id = 1;
                  function(err, resUpdated) {
                    if (err) throw err;
                    console.log("Thank you for shoping with us");
                  }
                );
              }
            });
        }
      });
    });
};
start();
