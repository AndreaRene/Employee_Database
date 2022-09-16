# Employee Database Manager

This command line application allows the user to view and edit an employee database.

The list of features are as follows:

* view all departments
* view all roles
* view all employees
* add a department
* add a role
* add an employee
* update an employee role
* update an employee manager
* view employees by manager
* delete departments, roles, and employees
* view the utilized budget of each department

You can find the demo video [here](https://drive.google.com/file/d/1eyZIk1VVUHzhtdfS__ArKxmYSTFsq8Ld/view) 
  
## Instalation

To install this application, clone the repo to your local repository. In your terminal, run the command `npm i` to install the modules. Create and setup your .env with your database and user information. 

## Usage 

Naviage to your local repo in your terminal. Open your mysql database. Execute `SOURCE db/schema.sql`. If you would like to use the seed data, execute `SOURCE db/seeds.sql`. Exit you mysql database and use the command `node index.js`. From there you will use the arrow keys to select actions and follow the prompts. 

## Technology and Resources Used

* mysql2
* chalk
* console.table
* inquirer
* dotenv
* JavaScript
* node.js



