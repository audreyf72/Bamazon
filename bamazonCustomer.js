var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "bootcamp2018",
  database: "bamazon_db"
});

inquirer
    .prompt({
    type: "confirm",
    message: "Welcome to Bamazon! Would you like to see our products?",
    name: "confirm",
    default: true
    })

    .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we display the complete product list.
        if (inquirerResponse.confirm) {
            console.log("") 
            console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *") 
            console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *") 
            console.log("* *                                 WELCOME TO BAMAZON!!                                  * *") 
            console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *") 
            console.log("* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *") 
            console.log("") 
            start();
            }

        else {
          console.log("\nOkay, come back when you are ready to shop!\n");
          connection.end();
        }
      });

function start(){
connection.query("SELECT * FROM products", function(err, res) {
  if(err) throw err;
      console.log("OUR PRODUCTS:")
      console.log("") 
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price);
      console.log("") 
      }
      askforID(res);
    })

function askforID(inventory) {
inquirer
  .prompt([
  {
    type: "input",
    name: "id",
    message: "What is the Item ID of the product you would like to purchase?",
 
  }
])
.then(function(val) {
  var choiceId = parseInt(val.id);
  var product = stockCheck(choiceId, inventory);

  if (product) {
    askforQTY(product);
  }
  else {
    console.log(choiceId + "That is not a valid item ID. Please check the ID and enter again.");
    start();
  }
});
}

function askforQTY(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);

      //Check and confirm stock availablity
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        start();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        buyProduct(product, quantity);
      }
    });
}

function buyProduct(product, quantity) {
  var totalPrice = parseFloat (quantity * product.price).toFixed(2);
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Confirm purchase
      console.log("\nYou just bought " + quantity + " " + product.product_name + "'s!");
      console.log("Your Total Price is: " + "$" + (totalPrice) + "\n");
      buyAgain();
    }
  );
}

function stockCheck(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}

function buyAgain() {
  inquirer
    .prompt({
    type: "confirm",
    message: "Would you like to buy another product?",
    name: "confirm",
    default: true
    })

    .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we display the complete product list.
        if (inquirerResponse.confirm) {
            start();
            }

        else {
          console.log("\nOkay, come back when you are ready to shop.");
          console.log("Thank you for shopping Bamazon!!\n");
          connection.end();
        }
      });

}

}
