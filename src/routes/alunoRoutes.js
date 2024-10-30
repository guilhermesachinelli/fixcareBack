const express = require('express')
const router = express.Router()
const alunoController = require('../controllers/alunoController')
router.get('/aluno', alunoController.getAlunos)
router.post('/aluno', alunoController.compareAluno)
router.post('/aluno/create', alunoController.createAluno);
module.exports = router;