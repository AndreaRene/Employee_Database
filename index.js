const mysql = require("mysql2");
const inquirer = require("inquirer");
const chalk = require("chalk");


// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'emp_track_db'
    },
    console.log(`Connected to the emp_track_db database.`)
);
const testQuery = `SELECT * FROM employee;`;
console.log(db.query(testQuery));

// first question after db table is shown
// const mainMenu = () => {
//     console.log(chalk.blue("Employee tracking database open."));
//     console.log("\n");
//     console.log(chalk.green("What would you like to do?"));

//     inquirer.prompt([
//         {
//             type: "list",
//             name: "choose",
//             choices: [
//                 "View all departments",
//                 "Add a department",
//                 chalk.red("Delete a department"),
//                 "View all roles",
//                 "Add a role",
//                 chalk.red("Delete a role"),
//                 "View all employees",
//                 "Add an employee",
//                 "Update an employee's role",
//                 "View employees by manager",
//                 "Update an employee's manager",
//                 "View employees by department",
//                 chalk.red("Delete an employee"),
//                 "View a department's utilized budget",
//                 chalk.blue("I'm done")
//             ]
//         }
//     ]).then(console.log("selected"));

// };

// mainMenu();