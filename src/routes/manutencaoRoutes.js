const express = require('express')
const router = express.Router()
const manutencaoController = require('../controllers/manutencaoController');
router.get('/manutencao', manutencaoController.getMaintenances)
router.get('/manutencao/:id', manutencaoController.getMaintenance)
router.post('/manutencao', manutencaoController.createMaintenance)
router.put('/manutencao/:id', manutencaoController.updateMaintenance)
module.exports = router;