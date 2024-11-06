const express = require('express');
const router = express.Router();
const geradorExcelController = require('../controllers/geradorExcelController.js');
router.get('/relatorio-excel-machine/:numero_de_patrimonio?', geradorExcelController.gerarRelatorioMachine);
router.get('/relatorio-excel-maintenance/:numero_de_patrimonio?', geradorExcelController.gerarRelatorioMaintenance);
router.get('/relatorio-excel-requestmaintenance/:numero_de_patrimonio?', geradorExcelController.gerarRelatorioRequestMaintenance);

module.exports = router;