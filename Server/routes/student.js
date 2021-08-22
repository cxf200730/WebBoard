const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const {getAllStudent, Login, Join} = require('../service/studentServer.js')

router.get('/', getAllStudent)

router.post('/login', Login)
router.post('/join', Join)
module.exports = router 