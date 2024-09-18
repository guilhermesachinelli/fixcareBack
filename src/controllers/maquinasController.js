const e = require('express');
const pool = require('../config/dbConfig');
async function getMaquinas(req, res) {
    try {
        const response = await pool.query('SELECT * FROM maquinas');
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json(error);
    }
}
async function getMaquina(req, res) {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM maquinas WHERE id = $1', [id]);
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
async function createMachine(req, res) {
    const {categoria,marca,modelo,numero_de_patrimonio,numero_de_serie,data_aquisicao, recomendacao_de_manutencao,oleo_lubrificante,status} = req.body;
    const query = 'INSERT INTO maquinas (categoria,marca,modelo,numero_de_patrimonio,numero_de_serie,data_aquisicao, recomendacao_de_manutencao,oleo_lubrificante,status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [categoria,marca,modelo,numero_de_patrimonio,numero_de_serie,data_aquisicao, recomendacao_de_manutencao,oleo_lubrificante,status];
    try{
        const response = await pool.query(query, values);
        res.status(201).json(response.rows[0]);
    }catch(error){
        res.status(500).json(error);
    }
}
async function deleteMachine() {
    try {
        const id = req.params.id;
        const response = await pool.query('DELETE FROM maquinas WHERE id = $1', [id]);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json(error);
    }
}
async function updateMachine() {
    const id = req.params.id;
    const {categoria,marca,modelo,numero_de_patrimonio,numero_de_serie,data_aquisicao, recomendacao_de_manutencao,oleo_lubrificante,status} = req.body;
    const query = 'UPDATE maquinas SET categoria = $1, marca = $2, modelo = $3, numero_de_patrimonio = $4, numero_de_serie = $5, data_aquisicao = $6, recomendacao_de_manutencao = $7, oleo_lubrificante = $8, status = $9 WHERE id = $10';
    const values = [categoria,marca,modelo,numero_de_patrimonio,numero_de_serie,data_aquisicao, recomendacao_de_manutencao,oleo_lubrificante,status,id];
    try{
        const result = await pool.query(query, values);
        if(result.rowCount == 0){
            return res.status(404).json({message: "Maquina não encontrada"});
        }
        else{
            return res.status(200).json({message: "Maquina atualizada com sucesso"});
        }
    }catch(error){
        res.status(500).json(error);
    }

}
module.exports = { getMaquinas, getMaquina,createMachine,deleteMachine,updateMachine };  