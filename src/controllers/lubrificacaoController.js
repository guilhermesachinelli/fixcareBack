const e = require('express');
const pool = require('../config/dbConfig');
async function getLubrifications(req, res) {
    try {
        const result = await pool.query('SELECT * FROM lubrificacao');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao obter a lista de lubrificações ', error);
    }
}
async function getLubrification(req, res) {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM lubrificacao WHERE id = $1', [id]);
    console.log(response.rows);
    try {
        if (response.rows == 0) {
            return res.status(404).json({ message: "Lubrificação não encontrada" });
        }
        else {
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
async function createLubrification(req, res) {
    const {
        numero_de_serieID ,
        oleo_lubrificante ,
        pontos_de_lubrificacao ,
        frequencia_de_lubrificacao ,
        quantidade_de_oleo ,
        imagem 
    } = req.body;
    
    const query = `
        INSERT INTO lubrificacao (
            numero_de_serieID ,
            oleo_lubrificante ,
            pontos_de_lubrificacao ,
            frequencia_de_lubrificacao ,
            quantidade_de_oleo ,
            imagem 
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
        try {
            if (!numero_de_serieID || !oleo_lubrificante || !pontos_de_lubrificacao || !frequencia_de_lubrificacao || !quantidade_de_oleo || !imagem) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }
            if (!numero_de_serieID) {
                return res.status(400).json({ message: 'O campo número de série é obrigatório' });
            }
            if (!oleo_lubrificante) {
                return res.status(400).json({ message: 'O campo óleo lubrificante é obrigatório' });
            }
            if (!pontos_de_lubrificacao) {
                return res.status(400).json({ message: 'O campo pontos de lubrificação é obrigatório' });
            }
            if (!frequencia_de_lubrificacao) {
                return res.status(400).json({ message: 'O campo frequência de lubrificação é obrigatório' });
            }
            if (frequencia_de_lubrificacao < 0) {
                return res.status(400).json({ message: 'A frequência de lubrificação não pode ser negativa' });
            }
            if (!quantidade_de_oleo) {
                return res.status(400).json({ message: 'O campo quantidade de óleo é obrigatório' });
            }
            if (quantidade_de_oleo < 0) {
                return res.status(400).json({ message: 'A quantidade de óleo não pode ser negativa' });
            }
            if (!imagem) {
                return res.status(400).json({ message: 'O campo imagem é obrigatório' });
            }
            if (imagem.length > 500) {
                return res.status(400).json({ message: 'O nome da imagem é muito grande' });
            }
            else {
                const response = await pool.query(query, [numero_de_serieID , oleo_lubrificante , pontos_de_lubrificacao , frequencia_de_lubrificacao , quantidade_de_oleo , imagem]);
                return res.status(201).json(response.rows);
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
}
async function updateLubrification(req, res) {
    const id = req.params.id;
    const {
        numero_de_serieID ,
        oleo_lubrificante ,
        pontos_de_lubrificacao ,
        frequencia_de_lubrificacao ,
        quantidade_de_oleo ,
        imagem 
    } = req.body;
    const query = `
        UPDATE lubrificacao SET
            numero_de_serieID = $1,
            oleo_lubrificante = $2,
            pontos_de_lubrificacao = $3,
            frequencia_de_lubrificacao = $4,
            quantidade_de_oleo = $5,
            imagem = $6
        WHERE id = $7
        RETURNING *`;
        let error = "Erro no dados enviados";
        let errorCount = 0;
        try {
            if(!numero_de_serieID){
                error += "numero_de_serieID, ";
                errorCount++;
            }
            if(!oleo_lubrificante){
                error += "oleo_lubrificante, ";
                errorCount++;
            }
            if(!pontos_de_lubrificacao){
                error += "pontos_de_lubrificacao, ";
                errorCount++;
            }
            if(!frequencia_de_lubrificacao){
                error += "frequencia_de_lubrificacao, ";
                errorCount++;
            }
            if(!quantidade_de_oleo){
                error += "quantidade_de_oleo, ";
                errorCount++;
            }
            if(!imagem){
                error += "imagem, ";
                errorCount++;
            }
            if(errorCount > 0){
                return res.status(400).json({ message: error });
            }
            else{
                const response = await pool.query(query, [numero_de_serieID , oleo_lubrificante , pontos_de_lubrificacao , frequencia_de_lubrificacao , quantidade_de_oleo , imagem , id]);
                return res.status(200).json(response.rows);
            }
        } catch (error) {
            res.status(500).json(error);
        }
}
async function deleteLubrification(req, res) {
    const id = req.params.id;
    try {
        const response = await pool.query('DELETE FROM lubrificacao WHERE id = $1', [id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Lubrificação não encontrada" });
        } else {
            return res.status(200).json({ message: "Lubrificação deletada com sucesso" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar a lubrificação" });
    }
}
module.exports = {getLubrifications, getLubrification, createLubrification, updateLubrification, deleteLubrification};