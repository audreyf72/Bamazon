var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    managerSelections();
  });

function managerSelections() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
  
      managerMenu(res);
    });
  }

function managerMenu(products) {
inquirer
    .prompt({
        type: "list",
        message: "Welcome Bamazon Manager! What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add a New Product"],
        name: "choice"
      })
      
      .then(function(val) {
        switch (val.choice) {
        case "View Products for Sale":
            console.table(products);
            managerSelections();
            break;
        case "View Low Inventory":
            displayLowInventory();
            break;
        case "Add to Inventory":
            addToInventory(products);
            break;    
        case "Add a New Product":
            newProductDetails(products);
            break;           
        default:
        console.log("Goodbye!");
        connection.end();
        break;      
        }
              
    });
}

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 10", function(err, res) {
    if(err) throw err; 
    managerSelections();
    });
}

function addToInventory(inventory) {
    console.table(inventory);
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID for the item you would like to add?",
            validate: function(val) {
                return !isNaN(val);
            }
        }
    ])
    .then(function(val) {
        var choiceID = parseInt (val.coice);
        var product = checkInventory(choiceID, inventory);

        if (product) {
            getQuantity(product);
        }
        else {
            console.log("\nAn item with that ID is not in the inventory.");
            managerSelections();
        }
    });
}

function getQuantity(product) {
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function(val) {
                return val > 0;
            }
        }
    ])
    .then(function(val) {
        var quantity = parseInt(val.quantity);
        addQuantity(product, quantity);
    });
}

function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [product.stock_quantity + quantity, product.item_id],
        function(err, res) {
            console.log("\nYou just added " + quantity + " " + product.product_name + "'s!\n");
            managerSelections();
        }
    );
}

function newProductDetails(products) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "product_name",
          message: "What is the name of the new product?"
        },
        {
          type: "list",
          name: "department_name",
          choices: getDepartments(products),
          message: "Add to which department?"
        },
        {
          type: "input",
          name: "price",
          message: "What is the price?",
          validate: function(val) {
            return val > 0;
          }
        },
        {
          type: "input",
          name: "quantity",
          message: "What is the current stock?",
          validate: function(val) {
            return !isNaN(val);
          }
        }
      ])
      .then(addNewProduct);
  }

  function addNewProduct(val) {
    connection.query(
      "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
      [val.product_name, val.department_name, val.price, val.quantity],
      function(err, res) {
        if (err) throw err;
        console.log(val.product_name + " has been added to inventory.\n");
        
       managerSelections();
      }
    );
  }

  function getDepartments(products) {
    var departments = [];
    for (var i = 0; i < products.length; i++) {
      if (departments.indexOf(products[i].department_name) === -1) {
        departments.push(products[i].department_name);
      }
    }
    return departments;
  }

  function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].item_id === choiceId) {
        return inventory[i];
      }
    }
    return null;
  }  
