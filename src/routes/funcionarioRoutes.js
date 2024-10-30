const express = require('express')
const router = express.Router()
const funcionarioController = require('../controllers/funcionarioController')
router.get('/funcionario', funcionarioController.getFuncionarios)
router.post('/funcionario', funcionarioController.compareFuncionario)
router.post('/funcionario/create', funcionarioController.createFuncionario);
module.exports = router;