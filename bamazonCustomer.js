var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;

    start();
});

function start() {
    inquirer
        .prompt(
            {
                name: "buyORexit",
                type: "list",
                message: "Would you like to purchase an item or exit?",
                choices: ["BUY", "EXIT"]
            })
            .then(function(answer) {
                if (answer.buyORexit === "BUY") {
                    selectItem();
                } else {
                    connection.end();
                }
            });
}

function selectItem() {
    connection.query("SELECT * FROM products", function(err, results) {
      console.log(results)
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].item_id && results[i].product_name);
              }
              return choiceArray;
            },
            message: "What item ID would you like to purchase?"
          },
          {
            name: "howMany",
            type: "input",
            message: "How many would you like to purchase?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          console.log("You selected: " + answer.choice);
          console.log("You selected " + answer.howMany + " items");
          //var stockUpdate = stock_quantity - answer.howMany;
          var chosenItem = answer.choice;
          for (var i = 0; i < results.length; i++) {
            if (results[i].item_id === answer.choice) {
              chosenItem = results[i];
            }
          }

          if (chosenItem === product_name) {
                connection.query(

                    `UPDATE products SET ${stockUpdate} WHERE item_id = ${chosenItem}`,

                    function(error) {
                        if (error) throw err;
                        console.log("That item is out of stock");
                        start();
                    }
                );
            } 
            else {
                console.log("Sorry, that item is sold out!");
                start();
            }
        });
    });
}