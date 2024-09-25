const express = require('express')
const router = express.Router()
const lubrificacaoController = require('../controllers/lubrificacaoController')
router.get('/lubrificacao', lubrificacaoController.getLubrifications)
router.get('/lubrificacao/:id', lubrificacaoController.getLubrification)
router.post('/lubrificacao', lubrificacaoController.createLubrification)
router.put('/lubrificacao/:id', lubrificacaoController.updateLubrification)
router.delete('/lubrificacao/:id', lubrificacaoController.deleteLubrification)
module.exports = router;