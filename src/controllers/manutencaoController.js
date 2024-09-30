const e = require('express');
const pool = require('../config/dbConfig');
async function getMaintenances(req, res) {
    try {
        const result = await pool.query('SELECT * FROM maintenance');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao obter a lista de manutenções ', error);
    }
}
async function getMaintenance(req, res) {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM maintenance WHERE id = $1', [id]);
    console.log(response.rows);
    try {
        if (response.rows == 0) {
            return res.status(404
            ).json({ message: "Manutenção não encontrada" });
        }
        else {
            return res.status(200).json(response.rows);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}
async function createMaintenance(req, res) {
    const {
        numero_de_serieID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_de_manutencao,
        descricao,
        status,
        oleo_lubrificante,
        pontos_de_lubrificacao,
        frequencia_de_lubrificacao,
        quantidade_de_oleo,
    } = req.body;

    console.log('Dados recebidos:', req.body);

    const queryManutencao = `
      INSERT INTO maintenance (
        numero_de_serieID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_de_manutencao,
        descricao,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const queryLubrificacao = `
      INSERT INTO lubrificacao (
        numero_de_serieID,
        oleo_lubrificante,
        pontos_de_lubrificacao,
        frequencia_de_lubrificacao,
        quantidade_de_oleo
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const valuesManutencao = [
        numero_de_serieID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_de_manutencao,
        descricao,
        status,
    ];

    const valuesLubrificacao = [
        numero_de_serieID,
        oleo_lubrificante,
        pontos_de_lubrificacao,
        frequencia_de_lubrificacao,
        quantidade_de_oleo,
    ];

    if (!numero_de_serieID) {
        return res.status(400).json({ message: 'Número de série é obrigatório' });
    }
    if (!nome_do_responsavel) {
        return res.status(400).json({ message: 'Nome do responsável é obrigatório' });
    }
    if (!tipo_de_manutencao) {
        return res.status(400).json({ message: 'Tipo de manutenção é obrigatório' });
    }
    if (!data_de_manutencao) {
        return res.status(400).json({ message: 'Data da manutenção é obrigatória' });
    }
    if (!descricao) {
        return res.status(400).json({ message: 'Descrição é obrigatória' });
    }
    if (!status) {
        return res.status(400).json({ message: 'Status é obrigatório' });
    }
    if (!oleo_lubrificante) {
        return res.status(400).json({ message: 'Óleo lubrificante é obrigatório' });
    }
    if (!pontos_de_lubrificacao) {
        return res.status(400).json({ message: 'Pontos de lubrificação são obrigatórios' });
    }
    if (!frequencia_de_lubrificacao) {
        return res.status(400).json({ message: 'Frequência de lubrificação é obrigatória' });
    }
    if (!quantidade_de_oleo) {
        return res.status(400).json({ message: 'Quantidade de óleo é obrigatória' });
    }
    if (frequencia_de_lubrificacao < 0) {
        return res.status(400).json({ message: 'A frequência de lubrificação não pode ser negativa' });
    }

    if (quantidade_de_oleo < 0) {
        return res.status(400).json({ message: 'A quantidade de óleo não pode ser negativa' });
    }
    try {

        const responseManutencao = await pool.query(queryManutencao, valuesManutencao);
        const responseLubrificacao = await pool.query(queryLubrificacao, valuesLubrificacao);

        return res.status(201).json({
            manutencao: responseManutencao.rows[0],
            lubrificacao: responseLubrificacao.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar manutenção');
    }
}
async function updateMaintenance(req, res) {
    const id = req.params.id;
    const {
        numero_de_serieID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_da_manutencao,
        descricao,
        status,
        oleo_lubrificante,
        pontos_de_lubrificacao,
        frequencia_de_lubrificacao,
        quantidade_de_oleo,
    } = req.body;

    const queryManutencao = `
        UPDATE maintenance
        SET
            numero_de_serieID = $1,
            nome_do_responsavel = $2,
            tipo_de_manutencao = $3,
            data_da_manutencao = $4,
            descricao = $5,
            status = $6
        WHERE id = $7
        RETURNING *`;

    const queryLubrificacao = `
        UPDATE lubrificacao
        SET
            oleo_lubrificante = $1,
            pontos_de_lubrificacao = $2,
            frequencia_de_lubrificacao = $3,
            quantidade_de_oleo = $4
        WHERE numero_de_serieID = $5
        RETURNING *`;

    const valuesManutencao = [
        numero_de_serieID,
        nome_do_responsavel,
        tipo_de_manutencao,
        data_da_manutencao,
        descricao,
        status,
        id
    ];

    const valuesLubrificacao = [
        oleo_lubrificante,
        pontos_de_lubrificacao,
        frequencia_de_lubrificacao,
        quantidade_de_oleo,
        numero_de_serieID
    ];
    try {
        // Verificações individuais para cada campo
        if (!numero_de_serieID) {
            return res.status(400).json({ message: 'Número de série é obrigatório' });
        }
        if (!nome_do_responsavel) {
            return res.status(400).json({ message: 'Nome do responsável é obrigatório' });
        }
        if (!tipo_de_manutencao) {
            return res.status(400).json({ message: 'Tipo de manutenção é obrigatório' });
        }
        if (!data_da_manutencao) {
            return res.status(400).json({ message: 'Data da manutenção é obrigatória' });
        }
        if (!descricao) {
            return res.status(400).json({ message: 'Descrição é obrigatória' });
        }
        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório' });
        }
        if (!oleo_lubrificante) {
            return res.status(400).json({ message: 'Óleo lubrificante é obrigatório' });
        }
        if (!pontos_de_lubrificacao) {
            return res.status(400).json({ message: 'Pontos de lubrificação são obrigatórios' });
        }
        if (!frequencia_de_lubrificacao) {
            return res.status(400).json({ message: 'Frequência de lubrificação é obrigatória' });
        }
        if (!quantidade_de_oleo) {
            return res.status(400).json({ message: 'Quantidade de óleo é obrigatória' });
        }
        if (frequencia_de_lubrificacao < 0) {
            return res.status(400).json({ message: 'A frequência de lubrificação não pode ser negativa' });
        }
        if (quantidade_de_oleo < 0) {
            return res.status(400).json({ message: 'A quantidade de óleo não pode ser negativa' });
        }
        else {
            // Atualizar dados na tabela maintenance
            const responseManutencao = await pool.query(queryManutencao, valuesManutencao);

            // Atualizar dados na tabela lubrificacao
            const responseLubrificacao = await pool.query(queryLubrificacao, valuesLubrificacao);

            return res.status(200).json({
                manutencao: responseManutencao.rows[0],
                lubrificacao: responseLubrificacao.rows[0]
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar manutenção: ' + error.message);
    }
}
module.exports = { getMaintenances, getMaintenance, createMaintenance, updateMaintenance };