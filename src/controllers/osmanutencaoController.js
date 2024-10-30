const e = require('express');
const pool = require('../config/dbConfig');
const moment = require('moment-timezone');

function formatarDataParaBrasileiro(dataISO, fusoHorario = 'America/Sao_Paulo') {
    // Verificar se dataISO é um objeto Date
    if (dataISO instanceof Date) {
        dataISO = dataISO.toISOString();
    }
    
    // Converter a data para o fuso horário especificado
    const dataNoFusoHorario = moment.tz(dataISO, fusoHorario);
    
    // Formatar a data no padrão brasileiro
    const dia = dataNoFusoHorario.format('DD');
    const mes = dataNoFusoHorario.format('MM');
    const ano = dataNoFusoHorario.format('YYYY');
    
    return `${dia}/${mes}/${ano}`;
}
async function getReqManutencao(req, res) {
    try {
        console.log('Executando consulta getReqManutencao...');
        const query = 'SELECT * FROM requestmaintenance';
        const response = await pool.query(query);

        // Formatar a data no padrão brasileiro para cada linha do resultado
        const formattedRows = response.rows.map(row => {
            return {
                ...row,
                data_de_solicitacao: formatarDataParaBrasileiro(row.data_de_solicitacao)
            };
        });

        res.status(200).json(formattedRows);
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta');
    }
}
async function getByNumeroDePatrimonioReqManutencao(req, res) {
    try {
        console.log('Executando consulta getByNumeroDePatrimonioReqManutencao...');
        const numeroDePatrimonio = req.params.numeroDePatrimonio;
        const query = 'SELECT * FROM requestmaintenance WHERE numero_de_patrimonioID = $1';
        const response = await pool.query(query, [numeroDePatrimonio]);

        // Formatar a data no padrão brasileiro para cada linha do resultado
        const formattedRows = response.rows.map(row => {
            return {
                ...row,
                data_de_solicitacao: formatarDataParaBrasileiro(row.data_de_solicitacao)
            };
        });
        res.status(200).json(formattedRows);
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta');
    }
}
async function getByidReqManutencao(req, res) {
    try {
        console.log('Executando consulta getByidReqManutencao...');
        const id = req.params.id;
        const query = 'SELECT * FROM requestmaintenance WHERE id = $1';
        const response = await pool.query(query, [id]);

        // Formatar a data no padrão brasileiro
        const formattedRow = {
            ...response.rows[0],
            data_de_solicitacao: formatarDataParaBrasileiro(response.rows[0].data_de_solicitacao)
        };

        res.status(200).json(formattedRow);
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro ao executar a consulta');
    }
}

async function createReqManutencao(req, res) {
    try {
        console.log('Executando consulta createReqManutencao...');
        const { numero_de_patrimonioID, nome, causa_do_problema, descricao, data_de_solicitacao } = req.body;

        // Formatar a data no padrão brasileiro
        const dataFormatada = formatarDataParaBrasileiro(data_de_solicitacao);

        // Definir o status como false
        const status = false;

        const query = 'INSERT INTO requestmaintenance (numero_de_patrimonioID, nome, causa_do_problema, descricao, data_de_solicitacao, status) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [numero_de_patrimonioID, nome, causa_do_problema, descricao, dataFormatada, status];
        await pool.query(query, values);
        res.status(201).send('Requisição de manutenção criada com sucesso');
    } catch (error) {
        console.error('Erro ao criar requisição de manutenção:', error);
        res.status(500).send('Erro ao criar requisição de manutenção');
    }
}
async function updateStatusReqManutencao(req, res) {
    try {
        console.log('Executando consulta updateStatusReqManutencao...');
        const { id } = req.params;

        const query = 'UPDATE requestmaintenance SET status = $1 WHERE id = $2';
        const values = [true, id];
        await pool.query(query, values);
        res.status(200).send('Status da requisição de manutenção atualizado com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar status da requisição de manutenção:', error);
        res.status(500).send('Erro ao atualizar status da requisição de manutenção');
    }
}

module.exports = {
    getReqManutencao,
    getByidReqManutencao,
    getByNumeroDePatrimonioReqManutencao,
    createReqManutencao,
    updateStatusReqManutencao
}