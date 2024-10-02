const e = require('express');
const pool = require('../config/dbConfig');
function formatarDataParaBrasileiro(dataISO) {
    // Verificar se dataISO é um objeto Date
    if (dataISO instanceof Date) {
        dataISO = dataISO.toISOString();
    }
    
    // Cortar a parte do 'T' para frente
    const dataApenas = dataISO.split('T')[0];
    
    // Criar um objeto Date com a data cortada
    const data = new Date(dataApenas);
    
    // Formatar a data no padrão brasileiro
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}
async function getMachines(req, res) {
    try {
        // Lógica para obter a lista de máquinas
        const result = await pool.query('SELECT * FROM machine');
        const machines = result.rows.map(machine => {
            machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
            machine.data_da_ultima_troca_de_oleo = formatarDataParaBrasileiro(machine.data_da_ultima_troca_de_oleo);
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
            machine.data_da_ultima_troca_de_oleo = formatarDataParaBrasileiro(machine.data_da_ultima_troca_de_oleo);
            return res.status(200).json(machine);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter a máquina', error: error.message });
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
            data_da_ultima_troca_de_oleo
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
    const errors = [];
    const countERROR = 0;

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
        if (data_da_ultima_troca_de_oleo === undefined || data_da_ultima_troca_de_oleo === '') {
            errors.push('data_da_ultima_troca_de_oleo');
            countERROR++;
        }
        if (errors.length > 0) {
            return res.status(400).json({ message: `Campos obrigatórios: ${errors.join(', ')}` });
        }
        
        const result = await pool.query(query, values);
        const machine = result.rows[0];
        machine.data_de_aquisicao = formatarDataParaBrasileiro(machine.data_de_aquisicao);
        machine.data_da_ultima_troca_de_oleo = formatarDataParaBrasileiro(machine.data_da_ultima_troca_de_oleo);
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
        data_da_ultima_troca_de_oleo,
    } = req.body;
    console.log('Dados recebidos:', req.body);
    const query = `
        UPDATE machine 
        SET categoria = $1, 
            marca = $2, 
            modelo = $3, 
            numero_de_patrimonio = $4, 
            numero_de_serie = $5, 
            numero_do_torno = $6, 
            data_de_aquisicao = $7, 
            data_da_ultima_troca_de_oleo = $8 
        WHERE id = $9`;

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
            // Fazer uma consulta SELECT para obter os dados atualizados
            const selectQuery = 'SELECT * FROM machine WHERE id = $1';
            const selectResult = await pool.query(selectQuery, [id]);
            const updatedMachine = selectResult.rows[0];
            updatedMachine.data_de_aquisicao = formatarDataParaBrasileiro(updatedMachine.data_de_aquisicao);
            updatedMachine.data_da_ultima_troca_de_oleo = formatarDataParaBrasileiro(updatedMachine.data_da_ultima_troca_de_oleo);
            return res.status(200).json({ message: "Máquina atualizada com sucesso", machine: updatedMachine });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Erro ao atualizar a máquina" });
    }
}
module.exports = { getMachines,getMachine,getbyNumeroDeSerieMachine,createMachine,deleteMachine,updateMachine };  