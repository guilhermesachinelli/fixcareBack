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

module.exports = { getMaquinas};