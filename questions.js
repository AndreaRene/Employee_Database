const inquirer = require("inquirer");
const chalk = require("chalk");

const mainMenu = (menuData) => {
    // console.log(chalk.black.bgMagenta("Please select from one of the following options. \n What would you like to do?"));

    inquirer.prompt([
        {
            type: "list",
            name: "select",
            choices: [
                "View all departments",
                "Add a department",
                "Delete a department",
                "View all roles",
                "Add a role",
                "Delete a role",
                "View all employees",
                "Add an employee",
                "Update an employee's role",
                "View employees by manager",
                "Update an employee's manager",
                "View employees by department",
                "Delete an employee",
                "View a department's utilized budget"
            ]
        }
    ])

}

mainMenu();