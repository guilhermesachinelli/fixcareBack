const e = require('express');
const pool = require('../config/dbConfig');
async function getMachines  (req, res) {
    try {
        // Lógica para obter a lista de máquinas
        const result = await pool.query('SELECT * FROM machine');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao obter a lista de máquinas ', error);
    }
}
async function getMachine(req, res) {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM machine WHERE id = $1', [id]);
    console.log(response.rows);
    try {
        if (response.rows == 0) {
            return res.status(404).json({ message: "Maquina no encontrada" });
        }
        else {
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
async function getbyNumeroDeSerieMachine(req, res) {
    const numeroDeSerie = req.params.numeroDeSerie;
    const response = await pool.query('SELECT * FROM machine WHERE numero_de_serie = $1', [numeroDeSerie]);
    console.log(response.rows);
    try {
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
async function createMachine(req, res) {
    const {
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
        data_da_ultima_troca_de_oleo,
    } = req.body;

    const query = `
        INSERT INTO machine (
            categoria,
            marca,
            modelo,
            numero_de_patrimonio,
            numero_de_serie,
            numero_do_torno,
            data_de_aquisicao,
            data_da_ultima_troca_de_oleo,
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

    const values = [
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
        data_da_ultima_troca_de_oleo,
    ];

    try {
        const response = await pool.query(query, values);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
}
async function deleteMachine(req, res) {
    const id = req.params.id;

    try {
        const response = await pool.query('DELETE FROM machine WHERE id = $1', [id]);
        console.log(response); // Adicionando console.log para depuração

        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            return res.status(200).json({ message: "Máquina deletada com sucesso" });
        }
    } catch (error) {
        console.error(error); // Adicionando console.error para depuração
        res.status(500).json({ error: "Erro ao deletar a máquina" });
    }
}
async function updateMachine(req, res) {
    const id = req.params.id;
    const {
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
        data_da_ultima_troca_de_oleo,
    } = req.body;
    const query = `
        UPDATE machine 
        SET categoria = $1, 
            marca = $2, 
            modelo = $3, 
            numero_de_patrimonio = $4, 
            numero_de_serie = $5, 
            numero_do_torno = $6, 
            data_de_aquisicao = $7, 
            data_da_ultima_troca_de_oleo = $12, 
        WHERE id = $13`;

    const values = [
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
        data_da_ultima_troca_de_oleo,
        id
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount == 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            return res.status(200).json({ message: "Máquina atualizada com sucesso" });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Erro ao atualizar a máquina" });
    }
}
module.exports = { getMachines,getMachine,getbyNumeroDeSerieMachine,createMachine,deleteMachine,updateMachine };  