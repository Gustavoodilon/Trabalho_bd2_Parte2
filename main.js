const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const readline = require('readline');

//Configuração do Banco
const HOST = "mysql-210170-0.cloudclusters.net";
const USER = "admin";
const PASSWORD = "64SAEtpb";
const DATABASE = "sakila";
const PORT = 10038;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: "mysql",
    port: PORT,
    logging: console.log
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
    date_of_birth: DataTypes.DATE,

    job_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Job,
            key: 'job_id'
        }
    }
});

Job.hasMany(Pessoa, { foreignKey: 'job_id' });
Pessoa.belongsTo(Job, { foreignKey: 'job_id' });

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

const results = [];
const jobs = [];

const rl = readline.createInterface({
    input: fs.createReadStream('people-100000.csv'),
    crlfDelay: Infinity
});

let isFirstLine = true;

rl.on('line', (line) => {

    if (isFirstLine) {
      isFirstLine = false;
      return;
    }
  
    line = line.replace(/^"|"$/g, '');
  
    const values = line.split(',');
  
    const obj = {};
    const job = {};

    let job_str = values[9] === undefined? values[8] : values[8] + values[9]
    job['job_title'] = job_str.replace(/^"|"$/g, '').replace(/"/g, '').trim();

    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    //coloca o job_title no obj pessoa para ser comparado
    //e colocar o job_id correspondente
    obj['job_title'] = job['job_title'];

    jobs.push(job)
    results.push(obj);
  
  });
  rl.on('close', async () => {
      //utilizando assim o sequelize faz a deleção em ordem correta das tabelas
      await sequelize.sync({ force: true });

      //esse map é feito para depois conseguir deixar valores unicos na inseção dos jobs
      const jobsMap = new Map();
      jobs.forEach(job => {
          jobsMap.set(job.job_title, job);
      });
      const jobsUnique = Array.from(jobsMap.values());
      await Job.bulkCreate(jobsUnique);

      //aqui pegamos todos jobs do banco e fazemos um map
      // para conseguir comparar e colocar o id nos registros de pessoas
      const jobsDB = await Job.findAll();
      const jobMap = new Map();
      jobsDB.forEach(job => {
          jobMap.set(job.job_title.trim().toLowerCase(), job.job_id);
      })

      //retorna a lista com os objetos pessoa com o job_id, e remove
      //o job title que nao existe na table
      const pessoasComJob = results.map(p => {
          const { id, job_title, ...rest } = p;

          return {
              ...rest,
              job_id: jobMap.get(job_title.trim().toLowerCase()) || 'teste'
          };
      });

     await Pessoa.bulkCreate(pessoasComJob);

  })

module.exports = {
    Pessoa,
    Job
}