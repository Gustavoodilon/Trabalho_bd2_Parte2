const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const readline = require('readline');

let results = [];

// Configuração do Banco
const HOST = "mysql-209830-0.cloudclusters.net";
const USER = "admin";
const PASSWORD = "81DvDok0";
const DATABASE = "sakila";
const PORT = 19121;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: "mysql",
    port: PORT,
    logging: false
});

// tabela de cargos
const Job = sequelize.define('job', {
    job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    job_title: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    tableName: 'jobs',
    timestamps: false
});

// tabela de pessoas
const Pessoa = sequelize.define('pessoa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    sex: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    date_of_birth: DataTypes.DATE
});

const headers = [
    'Index',
    'UserId',
    'FirstName',
    'LastName',
    'Sex',
    'Email',
    'Phone',
    'DateOfBirth',
    'JobTitle'
];

const rl = readline.createInterface({
    input: fs.createReadStream('people-100000.csv'),
    crlfDelay: Infinity
});

let isFirstLine = true;

let contador = 0;

rl.on('line', (line) => {

  if (isFirstLine) {
    isFirstLine = false;
    return;
  }

  line = line.replace(/^"|"$/g, '');

  const values = line.split(',');

  const obj = {};

  headers.forEach((header, index) => {
    obj[header] = values[index];
  });

  results.push(obj);

  contador++;

   // if (contador <= 100000) {
   //     console.log("Registro separado:");
        console.log(obj);
   // }

});

console.log(results);
