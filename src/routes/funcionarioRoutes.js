const express = require('express')
const router = express.Router()
const funcionarioController = require('../controllers/funcionarioController')
router.get('/funcionario', funcionarioController.getFuncionarios)
router.get('/funcionario', funcionarioController.compareFuncionario)
module.exports = router;