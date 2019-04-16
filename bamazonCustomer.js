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

//function that takes user input and connects that information to the mySQL database, and creates a pretty version of table
function selectItem() {
  //make the pretty table
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var table = new Table({
        head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
      });
      // once you have the items, prompt the user for which they'd like to bid on

      for (var i = 0; i < res.length; i++) {
        table.push([res[i].ItemId, res[i].ProductName, res[i].DepartmentName, res[i].Price.toFixed(2), res[i].StockQuantity]);
      }
      console.log("-----------------------------");
      console.log(table.toString());
      //get user input on which ID, and how many of that item they wish to purchase.
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
            // set answer of selected id to chosenId, and if 
              var chosenId = parseInt(answer.selectId);
               for (var i = 0; i < res.length; i++) {
                 if (chosenId === res[i].ItemId) {
                   chosenId = res[i];
                 } else if (chosenId > 10) {
                   console.log("You're ID number doesn't match any of our records")
                    selectItem();
                 }
               }

               console.log(chosenId.ItemId);
               //set chosenQuantity = the answer we gave the inquiry earlier about how many items we wanted.
              var chosenQuantity = parseInt(answer.Quantity);
              //variable that is the subtracted amount from database table and user input.
              var updatedQuantity = chosenId.StockQuantity - chosenQuantity;

              //if user amount selected is less then what is in the database, we run the UPDATE products...
                if (chosenQuantity < chosenId.StockQuantity) {
                  console.log("Your total for " + "(" + chosenQuantity + ")" + " - " + chosenId.ProductName + " is: " + chosenId.Price.toFixed(2) * chosenQuantity);
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
                    //if not we say too bad so sad.
                } else {
                  console.log("Sorry, insufficient Quanity at this time. All we have is " + chosenId.StockQuantity + " in our Inventory.");
                }
            });
    });
}


