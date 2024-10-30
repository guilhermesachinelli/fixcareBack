const e = require('express');
const pool = require('../config/dbConfig');
async function getFuncionarios(req, res) {
    try {
        const result = await pool.query('SELECT * FROM funcionario');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao obter a lista de funcionários:', error);
        res.status(500).send('Erro ao obter a lista de funcionários');
    }
}

async function compareFuncionario(req, res) {
    const { email, senha } = req.body;
    const errors = [];
    console.log('Dados recebidos:', req.body);

    if (!email) {
        errors.push({ message: "Email é obrigatório" });
    }
    if (!senha) {
        errors.push({ message: "Senha é obrigatória" });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const response = await pool.query('SELECT * FROM funcionario WHERE email = $1 AND senha = $2', [email, senha]);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Email ou senha incorretos" });
        } else {
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error('Erro ao comparar funcionário:', error);
        res.status(500).json({ error: "Erro ao comparar funcionário" });
    }
}
async function createFuncionario(req, res) {
    const { email, senha } = req.body;
    console.log('Dados recebidos:', req.body);
    try {
        const response = await pool.query('INSERT INTO funcionario (email, senha) VALUES ($1, $2)', [email, senha]);
        res.status(201).json({ message: 'Funcionário criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
}
module.exports = { getFuncionarios,compareFuncionario,createFuncionario };