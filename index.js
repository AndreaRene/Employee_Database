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
            case options.addDep:
                addDepartment();
                break;
            case options.deleteDep:
                deleteDepartment();
                break;
            case options.viewRoles:
                viewAllRoles();
                break;
            case options.addRole:
                addRole();
                break;
            case options.deleteRole:
                deleteRole();
                break;
            case options.viewEmps:
                viewAllEmps();
                break;
            case options.addEmp:
                addEmp();
                break;
            case options.updateRole:
                updateRole();
                break;
            case options.viewEmpByMan:
                empsByMan();
                break;
            case options.updateEmpMan:
                updateEmpMan();
                break;
            case options.viewEmpByDept:
                empsByDep();
                break;
            case options.deleteEmp:
                deleteEmp();
                break;
            case options.viewDepBudget:
                budgetByDep();
                break;
            case options.finish:
                db.end();
                break;
        };
    });
};

// view all departmentsz
const viewAllDepartments = async () => {
    console.log("\n");
    console.log(chalk.blue("Current departments:"));
    const vAllDeps = await db.promise().query("SELECT * FROM department;");
    console.table(vAllDeps[0]);
    mainMenu();
};

// add a department
const addDepartment = async () => {
    const vAllDeps = await db.promise().query("SELECT * FROM department;");
    console.log("\n");
    console.log(chalk.blue("Current Departments:"));
    console.table(vAllDeps[0]);
    const answers = await inquirer.prompt([{
        type: "input",
        name: "name",
        message: chalk.green("What is the name of the new department?")
    }
    ]);
    await db.promise().query("INSERT INTO department SET ?", answers);
    console.log("\n");
    console.log(chalk.blue("Department added successfully!"))
    viewAllDepartments();
};

// delete a department
const deleteDepartment = async () => {
    const dept = await db.promise().query("SELECT id AS value, name AS name FROM department;");
    console.log("\n");
    console.log(chalk.blue("Current Departments:"))
    console.table(dept[0]);
    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select the department to delete:"),
        choices: dept[0]
    }
    ]);
    // force to delete roles before department
    const hasRole = await db.promise().query("SELECT id FROM role WHERE department_id = ?;", [answers.id]);
    if (hasRole[0].toString() === "") {
        await db.promise().query("DELETE FROM department WHERE id = ?", [answers.id]);
        console.log("\n");
        console.log(chalk.blue("Department deleted successfully."));
        viewAllDepartments();
    } else {
        const curRole = await db.promise().query("SELECT title FROM role where department_id = ?", [answers.id]);
        console.log("\n");
        console.log(chalk.red("Please delete the following roles before deleting this department."));
        console.table(curRole[0]);
        mainMenu();
    }
};

// view all roles
const viewAllRoles = async () => {
    console.log("\n");
    console.log(chalk.blue("Current roles:"));
    const vAllRoles = await db.promise().query("SELECT title,salary,department.name FROM role JOIN department on role.department_id = department.id;");
    console.table(vAllRoles[0]);
    mainMenu();
};

// add a role
const addRole = async () => {
    const vAllRoles = await db.promise().query("SELECT title,salary,department.name FROM role JOIN department on role.department_id = department.id;")
    const deps = await db.promise().query("SELECT id AS value, name AS name FROM department;");
    console.log("\n");
    console.log(chalk.blue("Current Roles:"));
    console.table(vAllRoles[0]);
    const answers = await inquirer.prompt([{
        type: "input",
        name: "title",
        message: chalk.green("Please enter the new role title:"),
    },
    {
        type: "input",
        name: "salary",
        message: chalk.green("Please enter the new role's salary:"),
    },
    {
        type: "list",
        name: "department_id",
        message: chalk.green("Please select the department for the new role:"),
        choices: deps[0]
    }
    ]);
    await db.promise().query("INSERT INTO role SET ?", answers);
    console.log("\n");
    console.log(chalk.blue("Role added successfully!"));
    viewAllRoles();
};


// delete a role
const deleteRole = async () => {
    const role = await db.promise().query("SELECT id AS value, title AS name FROM role;");
    const roleTable = await db.promise().query("SELECT title, salary FROM role;");
    console.log("\n");
    console.log(chalk.blue("Current Roles:"));
    console.table(roleTable[0])
    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select the role to delete:"),
        choices: role[0]
    }
    ]);
    // force to reassign employees with role before deleting
    const hasEmp = await db.promise().query("SELECT id FROM employee WHERE role_id = ?;", [answers.id]);
    if (hasEmp[0].toString() === "") {
        await db.promise().query("DELETE FROM role WHERE id = ?", [answers.id]);
        console.log("\n")
        console.log(chalk.blue("Role deleted successfully."));
        viewAllRoles();
    } else {
        const curEmp = await db.promise().query("SELECT CONCAT(first_name, ' ', last_name) as name FROM employee where role_id = ?", [answers.id]);
        console.log("Please assign new roles to the following employees.");
        console.table(curEmp[0]);
        updateRole();
    }
};

// view all employees
const viewAllEmps = async () => {
    console.log("\n");
    console.log(chalk.blue("Current employees:"));
    const employees = await db.promise().query("SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS 'department',role.salary,CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr ON employee.manager_id = mgr.id;");
    console.table(employees[0]);
    mainMenu();
};

// add an employee
const addEmp = async () => {
    const roles = await db.promise().query("Select title As name, id AS value FROM role");
    const emps = await db.promise().query("Select id as value, CONCAT(first_name, ' ', last_name) as name FROM employee");
    const managers = emps[0];
    managers.push({ value: null, name: "none" });
    const answers = await inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: chalk.green("What is the new employee's first name?"),
    },
    {
        type: "input",
        name: "last_name",
        message: chalk.green("What is the new employee's last name?"),
    },
    {
        type: "list",
        name: "role_id",
        message: chalk.green("Please select the new role:"),
        choices: roles[0]
    },
    {
        type: "list",
        name: "manager_id",
        message: chalk.green("Please select the new employee's manager:"),
        choices: managers
    },
    ]);
    await db.promise().query("INSERT INTO employee SET ?", answers);
    console.log("\n");
    console.log(chalk.blue("Employee added successfully!"))
    viewAllEmps();
};

// update an employee role
const updateRole = async () => {
    const emps = await db.promise().query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;");
    const empsRoles = await db.promise().query("SELECT CONCAT(first_name, ' ', last_name) AS name, role.title FROM employee JOIN role on role.id = employee.role_id");
    console.log("\n");
    console.log(chalk.blue("Current roles:"))
    console.table(empsRoles[0]);
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
    console.log("\n");
    console.log(chalk.blue("Role updated successfully."))
    console.table(empsRoles[0]);
    console.log(chalk.red("Don't forget to update the employee manager if needed!"));
    mainMenu();
};

// view employees by manager
const empsByMan = async () => {
    console.log("\n");
    console.log(chalk.blue("Current managers and associated employees:"))
    const emps = await db.promise().query("SELECT CONCAT(mgr.first_name, ' ', mgr.last_name) AS 'manager', CONCAT(employee.first_name, ' ', employee.last_name) AS 'employee'FROM employee LEFT OUTER JOIN employee mgr ON employee.manager_id =mgr.id WHERE employee.manager_id IS NOT NULL;");
    console.table(emps[0]);
    mainMenu();
};

// update an employee manager
const updateEmpMan = async () => {
    const curEmps = await db.promise().query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS 'employee',  CONCAT(mgr.first_name, ' ', mgr.last_name) AS 'manager' FROM employee LEFT OUTER JOIN employee mgr ON employee.manager_id =mgr.id WHERE employee.manager_id IS NOT NULL;");
    console.log("\n");
    console.log(chalk.blue("Current employees and associated managers:"))
    console.table(curEmps[0]);
    const emps = await db.promise().query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;");
    const mgr = await db.promise().query("SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee;");
    const manager = mgr[0];
    manager.push({ value: null, name: "none" });

    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select the employee to update:"),
        choices: emps[0]
    },
    {
        type: "list",
        name: "manager_id",
        message: chalk.green("Please select the new manager:"),
        choices: manager
    }
    ]);
    await db.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?", [answers.manager_id, answers.id]);
    const newEmps = await db.promise().query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS 'employee',  CONCAT(mgr.first_name, ' ', mgr.last_name) AS 'manager' FROM employee LEFT OUTER JOIN employee mgr ON employee.manager_id =mgr.id WHERE employee.manager_id IS NOT NULL;");
    console.log("\n");
    console.log(chalk.blue("Employee manager updated successfully."));
    console.table(newEmps[0]);
    console.log(chalk.red("Don't forget to update the employee role if needed!"));
    mainMenu();
};

// view employees by department
const empsByDep = async () => {
    console.log("\n");
    console.log(chalk.blue("Current departments and associated employees:"));
    const emps = await db.promise().query("SELECT department.name AS 'department', CONCAT(employee.first_name, ' ', employee.last_name) AS 'employee' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;");
    console.table(emps[0]);

    mainMenu();
};

// remove emp id
// delete employees
const deleteEmp = async () => {
    const emp = await db.promise().query("SELECT id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee;");
    const empTable = await db.promise().query("SELECT CONCAT(first_name, ' ', last_name) AS 'name' FROM employee;");
    console.log("\n");
    console.log(chalk.blue("Current employees:"));
    // here
    // console.log("test");
    console.table(empTable[0]);
    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select the employee to delete:"),
        choices: emp[0]
    }
    ]);
    // force to reassign direct reports before delete
    const isManager = await db.promise().query("SELECT id FROM employee WHERE manager_id = ?;", [answers.id]);
    if (isManager[0].toString() === "") {
        await db.promise().query("DELETE FROM employee WHERE id = ?", [answers.id]);
        console.log("\n");
        console.log(chalk.blue("Employee Successfully Deleted."));
        viewAllEmps();
    } else {
        console.log("Please reassign employees that report to this employee before deleting.")
        updateEmpMan();
    }
};


// view dept utilized budgets
const budgetByDep = async () => {
    const dept = await db.promise().query("SELECT id as value, name as name FROM department");
    const answers = await inquirer.prompt([{
        type: "list",
        name: "id",
        message: chalk.green("Please select a department to view it's utilized budget:"),
        choices: dept[0]
    }
    ]);
    const budget = await db.promise().query("SELECT department.name, SUM(role.salary) AS budget FROM employee JOIN role ON role.id=employee.role_id JOIN department ON department.id=role.department_id WHERE department.id = ? GROUP BY department.name", [answers.id]);
    console.log("\n");
    console.log(chalk.blue("Utilized Budget:"));
    console.table(budget[0]);
    mainMenu();
};
