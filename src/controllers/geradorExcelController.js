const e = require('express');
const ExcelJS = require('exceljs');
const pool = require('../config/dbConfig'); // Ajuste o caminho conforme necessário

async function gerarRelatorioExcel(nomeTabela, colunas) {
    try {
        const result = await pool.query(`SELECT * FROM ${nomeTabela} ORDER BY numero_de_patrimonio`);
        const dados = result.rows;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Relatório');

        // Defina as colunas com os cabeçalhos corretos
        worksheet.columns = colunas;

        // Adiciona os dados à planilha
        dados.forEach(dado => {
            worksheet.addRow(dado);
        });

        // Gera o arquivo Excel
        const caminhoArquivo = `relatorio_${nomeTabela}.xlsx`;
        await workbook.xlsx.writeFile(caminhoArquivo);
        return caminhoArquivo;
    } catch (erro) {
        console.error(erro);
        throw new Error('Erro ao gerar o relatório.');
    }
}

async function gerarRelatorioMachine(req, res) {
    try {
        const colunasMachine = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Categoria', key: 'categoria', width: 30 },
            { header: 'Marca', key: 'marca', width: 30 },
            { header: 'Modelo', key: 'modelo', width: 30 },
            { header: 'Número de Patrimônio', key: 'numero_de_patrimonio', width: 30 },
            { header: 'Número de Série', key: 'numero_de_serie', width: 30 },
            { header: 'Número do Torno', key: 'numero_do_torno', width: 15 },
            { header: 'Data de Aquisição', key: 'data_de_aquisicao', width: 15 },
        ];
        const numeroDePatrimonio = req.query.numero_de_patrimonio;
        const caminhoArquivo = await gerarRelatorioExcel('machine', colunasMachine, numeroDePatrimonio);
        res.download(caminhoArquivo);
    } catch (erro) {
        res.status(500).send(erro.message);
    }
}

async function gerarRelatorioMaintenance(req, res) {
    try {
        const colunasMaintenance = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Número de Patrimônio', key: 'numero_de_patrimonioID', width: 30 },
            { header: 'Nome do Responsável', key: 'nome_do_responsavel', width: 30 },
            { header: 'Tipo de Manutenção', key: 'tipo_de_manutencao', width: 30 },
            { header: 'Descrição', key: 'descricao', width: 50 },
            { header: 'Data de Manutenção', key: 'data_de_manutencao', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
        ];
        const numeroDePatrimonio = req.query.numero_de_patrimonio;
        const caminhoArquivo = await gerarRelatorioExcel('maintenance', colunasMaintenance, numeroDePatrimonio);
        res.download(caminhoArquivo);
    } catch (erro) {
        res.status(500).send(erro.message);
    }
}

async function gerarRelatorioRequestMaintenance(req, res) {
    try {
        const colunasRequestMaintenance = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Número de Patrimônio', key: 'numero_de_patrimonioID', width: 30 },
            { header: 'Nome', key: 'nome', width: 30 },
            { header: 'Causa do Problema', key: 'causa_do_problema', width: 30 },
            { header: 'Descrição', key: 'descricao', width: 50 },
            { header: 'Data de Solicitação', key: 'data_de_solicitacao', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
        ];
        const numeroDePatrimonio = req.query.numero_de_patrimonio;
        const caminhoArquivo = await gerarRelatorioExcel('requestmaintenance', colunasRequestMaintenance, numeroDePatrimonio);
        res.download(caminhoArquivo);
    } catch (erro) {
        res.status(500).send(erro.message);
    }
}
module.exports = { gerarRelatorioMachine, gerarRelatorioMaintenance, gerarRelatorioRequestMaintenance };