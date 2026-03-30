const { Sequelize, DataTypes } = require('sequelize');

// Configuração do Banco de Dados
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

//armazenando titulos de profissoes unicos para evitar redundancia de dados
const job = sequelize.define('job', {
    job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    job_title: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true //garante que cada cargo seja único
   }
}, {
        tableName: 'jobs',
        timestamps: false
    });

const pessoa = sequelize.define('pessoa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true //garante que cada pessoa tenha um user.id único
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sex: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
});