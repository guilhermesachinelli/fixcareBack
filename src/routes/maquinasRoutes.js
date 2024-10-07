const express = require('express')
const router = express.Router()
const maquinasController = require('../controllers/maquinasController')
router.get('/machine', maquinasController.getMachines)
router.get('/machine/:id', maquinasController.getMachine)
router.get('/machine/patrimonio/:numeroDePatrimonio', maquinasController.getbyNumeroDePatrimonioMachine);
router.post('/machine', maquinasController.createMachine)
router.delete('/machine/:id', maquinasController.deleteMachine)
router.put('/machine/:id', maquinasController.updateMachine)
module.exports = router;