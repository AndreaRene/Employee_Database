const mysql = require("mysql2");
const inquirer = require("inquirer");
const chalk = require("chalk");
require("dotenv").config();
require("console.table");

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    console.log(`Connected to the emp_track_db database.`)
);

db.connect(err => {
    if (err) throw err;
    mainMenu();
});

const options = {
    viewDeps: "View all departments",
    addDep: "Add a department",
    deleteDep: chalk.red("Delete a department"),
    viewRoles: "View all roles",
    addRole: "Add a role",
    deleteRole: chalk.red("Delete a role"),
    viewEmps: "View all employees",
    addEmp: "Add an employee",
    updateRole: "Update an employee's role",
    viewEmpByMan: "View employees by manager",
    updateEmpMan: "Update an employee's manager",
    viewEmpByDept: "View employees by department",
    deleteEmp: chalk.red("Delete an employee"),
    viewDepBudget: "View a department's utilized budget",
    finish: chalk.blue("I'm done")
}

// first question after db table is shown
const mainMenu = () => {
    console.log("\n");
    inquirer.prompt({
        type: "list",
        name: "selection",
        message: chalk.green("What would you like to do?"),
        choices: [
            options.viewDeps,
            options.addDep,
            options.deleteDep,
            options.viewRoles,
            options.addRole,
            options.deleteRole,
            options.viewEmps,
            options.addEmp,
            options.updateRole,
            options.viewEmpByMan,
            options.updateEmpMan,
            options.viewEmpByDept,
            options.deleteEmp,
            options.viewDepBudget,
            options.finish
        ]
    }).then(answer => {
        switch (answer.selection) {
            case options.viewDeps:
                viewAllDepartments();
                break;
            case options.updateRole:
                updateRole();
                break;
            case options.viewEmps:
                viewAllEmps();
                break;
        }
    });
};

const viewAllDepartments = async () => {
    const vAllDeps = await db.promise().query("SELECT * FROM department;");
    console.table(vAllDeps[0]);
    mainMenu();
}

const updateRole = async () => {
    const emps = await db.promise().query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;");
    const roles = await db.promise().query("SELECT id AS value, title AS name FROM role;");

    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select the employee to update:"),
        choices: emps[0]
    },
    {
        type: "list",
        name: "role_id",
        message: chalk.green("Please select the new role:"),
        choices: roles[0]
    }
    ]);
    await db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id]);
    updateManager(answers.role_id, answers.id);
}

const updateManager = async (roleID, employeeID) => {
    const manager = await db.promise().query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE role_id =  and manager_id = 0000;");
    // , [roleID]);
    const answers = await inquirer.prompt([{
        type: "list",
        name: "manager_id",
        message: chalk.green("Please select the manager to update:"),
        choices: manager[0]
    }
    ]);
    await db.promise().query()("UPDATE employee SET manager_id = ? WHERE id = ?", [answers.manager_id, employeeID]);
    console.log("Update successful");
    viewAllEmps();
}

const viewAllEmps = async () => {
    const employees = await db.promise().query("SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS 'department',role.salary,CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr ON employee.manager_id = mgr.id;");
    console.table(employees[0]);
    mainMenu();
}