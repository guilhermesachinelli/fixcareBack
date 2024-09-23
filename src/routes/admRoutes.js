const express = require('express')
const router = express.Router()
const admController = require('../controllers/admController')
router.get('/admin', admController.getAdmins)
router.post('/admin', admController.compareAdmin)
module.exports = router;