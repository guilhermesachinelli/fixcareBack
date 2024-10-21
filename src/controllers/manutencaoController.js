const e = require('express');
const pool = require('../config/dbConfig.js');
const { sendMessage } = require('../whatsapp');
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
async function getMaintenances(req, res) {
    try {
        const result = await pool.query('SELECT * FROM maintenance');
        const manutencoes = result.rows.map(manut => {
            if (manut.data_de_manutencao) {
                manut.data_de_manutencao = formatarDataParaBrasileiro(manut.data_de_manutencao);
            }
            return manut;
        });
        res.status(200).json(manutencoes);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao obter a lista de manutenções ', error);
    }
}
async function getMaintenance(req, res) {
    const id = req.params.id;
    try {
        const response = await pool.query('SELECT * FROM maintenance WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).
                json({ message: "Manutenção não encontrada" });
        }
        else {
            const manutencao = response.rows[0];
            manutencao.data_de_manutencao = formatarDataParaBrasileiro(manutencao.data_de_manutencao);
            return res.status(200).json(manutencao);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}


async function createMaintenance(req, res) {
    const {
        numero_de_patrimonioID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_de_manutencao,
        descricao,
        status
    } = req.body;

    console.log('Dados recebidos:', req.body);

    const queryManutencao = `
        INSERT INTO maintenance (
        numero_de_patrimonioID,
        nome_do_responsavel,
        tipo_de_manutencao,
        descricao,
        data_de_manutencao,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const valuesManutencao = [
        numero_de_patrimonioID,
        nome_do_responsavel,
        tipo_de_manutencao,
        descricao,
        data_de_manutencao,
        status,
    ];
    try {
        const responseManutencao = await pool.query(queryManutencao, valuesManutencao);
        const manutencaoCriada = responseManutencao.rows[0];

        if (!numero_de_patrimonioID) {
            return res.status(400).json({ message: 'Número de patrimônio é obrigatório' });
        }
        if (!nome_do_responsavel) {
            return res.status(400).json({ message: 'Nome do responsável é obrigatório' });
        }
        if (!data_de_manutencao) {
            return res.status(400).json({ message: 'Data da manutenção é obrigatória' });
        }
        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório' });
        }
        if (tipo_de_manutencao !== 'Preventiva' && tipo_de_manutencao !== 'Corretiva' && tipo_de_manutencao !== 'Lubrificação') {
            return res.status(400).json({ message: 'Descrição é obrigatória' });
        }
        if (!tipo_de_manutencao) {
            return res.status(400).json({ message: 'Tipo de manutenção é obrigatório' });
        }

        if (manutencaoCriada.tipo_de_manutencao !== 'Lubrificação') {
            const dataFormatada = formatarDataParaBrasileiro(manutencaoCriada.data_de_manutencao);
            const message = `*Manutenção:*\nDia: ${dataFormatada}\nNome do responsável: ${manutencaoCriada.nome_do_responsavel}\nTipo de manutenção: ${manutencaoCriada.tipo_de_manutencao}`.trim();

            console.log('Mensagem montada:', message);

            // Substitua 'Nome do Grupo' pelo nome do grupo ou ID do contato
            await sendMessage(process.env.GROUPID, message);
        }


        return res.status(201).json({
            manutencao: {
                numero_de_patrimonioID: manutencaoCriada.numero_de_patrimonioID,
                nome_do_responsavel: manutencaoCriada.nome_do_responsavel,
                tipo_de_manutencao: manutencaoCriada.tipo_de_manutencao,
                descricao: manutencaoCriada.descricao,
                data_de_manutencao: formatarDataParaBrasileiro(manutencaoCriada.data_de_manutencao),
                status: manutencaoCriada.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar manutenção');
    }
}
async function updateMaintenance(req, res) {
    const id = req.params.id;
    const {
        numero_de_patrimonioID,
        nome_do_responsavel,
        tipo_de_manutencao,
        descricao,
        data_de_manutencao,
        status
    } = req.body;

    const queryManutencao = `
        UPDATE maintenance
        SET
            numero_de_patrimonioID = $1,
            nome_do_responsavel = $2,
            tipo_de_manutencao = $3,
            descricao = $4,
            data_de_manutencao = $5,
            status = $6
        WHERE id = $7
        RETURNING *`;


    const valuesManutencao = [
        numero_de_patrimonioID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_de_manutencao,
        descricao,
        status,
        id
    ];

    try {
        // Verificações individuais para cada campo
        if (!numero_de_patrimonioID) {
            return res.status(400).json({ message: 'Número de patrimônio é obrigatório' });
        }
        if (!nome_do_responsavel) {
            return res.status(400).json({ message: 'Nome do responsável é obrigatório' });
        }
        if (tipo_de_manutencao !== 'Preventiva' || tipo_de_manutencao !== 'Corretiva' || tipo_de_manutencao !== 'Lubrificação - Diária' || tipo_de_manutencao !== 'Lubrificação - Semanal' || tipo_de_manutencao !== 'Lubrificação - Mensal' || tipo_de_manutencao !== 'Lubrificação - Anual') {
            return res.status(400).json({ message: 'Tipo de manutenção inválido' });
        }
        if (!data_de_manutencao) {
            return res.status(400).json({ message: 'Data da manutenção é obrigatória' });
        }
        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório' });
        }
        else {
            // Atualizar dados na tabela maintenance
            const responseManutencao = await pool.query(queryManutencao, valuesManutencao);
            return res.status(200).json({
                manutencao: responseManutencao.rows[0],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar manutenção: ' + error.message);
    }
}
module.exports = { getMaintenances, getMaintenance, createMaintenance, updateMaintenance };