const e = require('express');
const pool = require('../config/dbConfig');
async function getAlunos(req, res){
    try{
        const result = await pool.query('SELECT * FROM aluno');
        res.status(200).json(result.rows);
    }catch(error){
        console.error(error)
        res.status(500).send('Erro ao obter a lista de alunos ', error);
    }
}
async function compareAluno(req, res){
    const {email, senha} = req.body;
    const errors = [];
    const errorCount = 0;
    console.log('Dados recebidos:', req.body);
    if(!email){
        errors.push({message: "Email é obrigatório"});
        errorCount++;
    }
    if(!senha){
        errors.push({message: "Senha é obrigatório"});
        errorCount++;
    }
    if(errors.length > 0){
        return res.status(400).json({errors});
    }
    try{
        const response = await pool.query('SELECT * FROM aluno WHERE email = $1 AND senha = $2', [email, senha]);
        if(response.rows.length === 0){
            return res.status(404).json({message: "Email ou senha incorretos"});
        }else{
            return res.status(200).json(response.rows);
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Erro ao comparar aluno"});
    }
}
module.exports = {getAlunos, compareAluno};