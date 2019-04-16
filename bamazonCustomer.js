var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  selectItem();
});

function selectItem() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var table = new Table({
        head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
      });
      // once you have the items, prompt the user for which they'd like to bid on

      for (var i = 0; i < res.length; i++) {
        table.push([res[i].ItemId, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]);
      }
      console.log("-----------------------------");
      console.log(table.toString());
      inquirer
        .prompt([
          {
            name: "selectId",
            type: "input",
            message: "What is the item ID you would like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
              }
          }, {
            name: "Quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function(value) {
              if (isNaN(value) == false) {
                return true;
              } else {
                return false;
              }
            }
          }]).then(function(answer) {

              var chosenId = parseInt(answer.selectId);
               for (var i = 0; i < res.length; i++) {
                 if (chosenId === res[i].ItemId) {
                   console.log("It works");
                   chosenId = res[i];
                 } else if (chosenId > 10) {
                    selectItem();
                 }
               }

               console.log(chosenId.ItemId);
              var chosenQuantity = parseInt(answer.Quantity);
              var updatedQuantity = chosenId.StockQuantity - chosenQuantity;

                if (chosenQuantity < chosenId.StockQuantity) {
                  //console.log("Your total for " + "(" + chosenQuantity + ")" + " - " + chosenId.ProductName + " is: " + chosenId.Price * chosenQuantity);
                  connection.query(
                    "UPDATE products SET ? WHERE ?", 
                    [
                      {
                        StockQuantity: updatedQuantity
                      }, 
                      {
                        ItemId: chosenId.ItemId
                      }
                    ], function(err, res) {
                        if (err) throw err;
                        selectItem();
                    });
      
                } else {
                  console.log("Sorry, insufficient Quanity at this time. All we have is " + chosenId.StockQuantity + " in our Inventory.");
                }
            });
    });
}


