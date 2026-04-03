const express = require('express');
const cors = require('cors');
const path = require('path');
const {Op} = require('sequelize');

const {Pessoa, Job} = require('./main.js')
const {response} = require("express");

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/buscar-nome', async (req, res) => {
    const termo = req.query.termo;

    const pessoas = await Pessoa.findAll({
        where: {
            [Op.or]: [
                { first_name: { [Op.like]: `%${termo}%` } },
                { last_name: { [Op.like]: `%${termo}%` } }
            ]
        },
        include: Job
    });

    res.json(pessoas);
});

app.get('/buscar-job', async (req, res) => {
    const termo = req.query.termo;

    const pessoas = await Pessoa.findAll({
        include: {
            model: Job,
            where: {
                job_title: {
                    [Op.like]: `%${termo}%`
                }
            }
        }
    });

    res.json(pessoas);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))