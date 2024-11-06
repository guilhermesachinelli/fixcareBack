const express = require('express');
const router = express.Router();
const geradorExcelController = require('../controllers/geradorExcelController');

router.get('/relatorio-excel-machine', geradorExcelController.gerarRelatorioMachine);
router.get('/relatorio-excel-maintenance', geradorExcelController.gerarRelatorioMaintenance);
router.get('/relatorio-excel-requestmaintenance', geradorExcelController.gerarRelatorioRequestMaintenance);

module.exports = router;