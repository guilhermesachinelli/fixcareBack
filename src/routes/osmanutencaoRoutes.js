const express = require('express')
const router = express.Router()
const osmanutencaoController = require('../controllers/osmanutencaoController.js')
router.get('/requestmaintenance', osmanutencaoController.getReqManutencao)
router.get('/requestmaintenance/:id', osmanutencaoController.getByidReqManutencao)
router.get('/requestmaintenance/patrimonio/:numeroDePatrimonio', osmanutencaoController.getByNumeroDePatrimonioReqManutencao)
router.post('/requestmaintenance', osmanutencaoController.createReqManutencao)
router.put('/requestmaintenance/:id', osmanutencaoController.updateStatusReqManutencao)
module.exports = router;