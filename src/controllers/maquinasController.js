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
async function getMachines(req, res) {
    try {
        // Lógica para obter a lista de máquinas
        const result = await pool.query('SELECT * FROM machine');
        const machines = result.rows.map(machine => {
            if (machine.data_de_aquisicao) {
                machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
            }
            return machine;
        });
        res.status(200).json(machines);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter a lista de máquinas', error);
    }
}

async function getMachine(req, res) {
    const id = req.params.id;
    try {
        const response = await pool.query('SELECT * FROM machine WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            const machine = response.rows[0];
            machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
            return res.status(200).json(machine);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter a máquina', error: error.message });
    }
}
async function getbyNumeroDePatrimonioMachine(req, res) {
    const numeroDePatrimonio = req.params.numeroDePatrimonio;
    try {
        const response = await pool.query('SELECT * FROM machine WHERE numero_de_patrimonio = $1', [numeroDePatrimonio]);
        console.log(response.rows);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            const machines = response.rows.map(machine => {
                if (machine.data_de_aquisicao) {
                    machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
                }
                return machine;
            });
            return res.status(200).json(machines);
        }
    } catch (error) {
        console.error('Erro ao obter a máquina:', error);
        res.status(500).json({ message: 'Erro ao obter a máquina', error: error.message });
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
    } = req.body;

    const query = `
        INSERT INTO machine (
            categoria,
            marca,
            modelo,
            numero_de_patrimonio,
            numero_de_serie,
            numero_do_torno,
            data_de_aquisicao
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;

    const values = [
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
    ];
    const errors = [];
    let countERROR = 0;

    try {
        if (categoria === undefined || categoria === '') {
            errors.push('categoria');
            countERROR++;
        }
        if (marca === undefined || marca === '') {
            errors.push('marca');
            countERROR++;
        }
        if (modelo === undefined || modelo === '') {
            errors.push('modelo');
            countERROR++;
        }
        if (numero_de_patrimonio === undefined || numero_de_patrimonio === '') {
            errors.push('numero_de_patrimonio');
            countERROR++;
        }
        if (numero_de_serie === undefined || numero_de_serie === '') {
            errors.push('numero_de_serie');
            countERROR++;
        }
        if (numero_do_torno === undefined || numero_do_torno === '') {
            errors.push('numero_do_torno');
            countERROR++;
        }
        if (data_de_aquisicao === undefined || data_de_aquisicao === '') {
            errors.push('data_de_aquisicao');
            countERROR++;
        }
        if (errors.length > 0) {
            return res.status(400).json({ message: `Campos obrigatórios: ${errors.join(', ')}` });
        }
        
        const result = await pool.query(query, values);
        const machine = result.rows[0];
        machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
        console.log(machine); // Adicionando console.log para depuração
        return res.status(201).json(machine);
    } catch (error) {
        console.error('Error inserting machine:', error.message);
        return res.status(500).json({ message: 'Erro ao criar máquina', error: error.message });
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
    } = req.body;

    const query = `
        UPDATE machine 
        SET categoria = $1, 
            marca = $2, 
            modelo = $3, 
            numero_de_patrimonio = $4, 
            numero_de_serie = $5, 
            numero_do_torno = $6, 
            data_de_aquisicao = $7
        WHERE id = $8`;

    const values = [
        categoria,
        marca,
        modelo,
        numero_de_patrimonio,
        numero_de_serie,
        numero_do_torno,
        data_de_aquisicao,
        id
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount == 0) {
            return res.status(404).json({ message: "Máquina não encontrada" });
        } else {
            // Fazer uma consulta SELECT para obter os dados atualizados
            const selectQuery = 'SELECT * FROM machine WHERE id = $1';
            const selectResult = await pool.query(selectQuery, [id]);
            const updatedMachine = selectResult.rows[0];
            updatedMachine.data_de_aquisicao = formatarDataParaBrasileiro(updatedMachine.data_de_aquisicao);
            return res.status(200).json({ message: "Máquina atualizada com sucesso", machine: updatedMachine });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Erro ao atualizar a máquina" });
    }
}
module.exports = { getMachines,getMachine,getbyNumeroDePatrimonioMachine,createMachine,deleteMachine,updateMachine };  