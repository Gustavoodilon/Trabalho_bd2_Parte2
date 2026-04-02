const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const readline = require('readline');

let results = [];
let jobs = [];
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
        defaultValue: "pad"
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    sex: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    date_of_birth: DataTypes.DATE
});

const headers = [
    'id',
    'user_id',
    'first_name',
    'last_name',
    'sex',
    'email',
    'phone',
    'date_of_birth'
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
    const job = {};
  
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
      job_str = values[9] === undefined? values[8] : values[8] + values[9]
      job['job_title'] = job_str.replace(/^"|"$/g, '').replace(/"/g, '').trim();
  
    jobs.push(job)
    results.push(obj);
  
  });
  rl.on('close', async () => {
      const jobsMap = new Map();
        console.log(jobs)
      jobs.forEach(job => {
          jobsMap.set(job.job_title, job);
      });
  
      const jobsUnique = Array.from(jobsMap.values());
      console.log(jobsUnique.length, results.length)
  
      await Job.sync({force: true});
      await Job.bulkCreate(jobsUnique);
  
      await Pessoa.sync({force: true})
      await Pessoa.bulkCreate(results);
  })