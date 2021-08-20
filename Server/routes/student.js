const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const {getAllStudent, Login} = require('../service/studentServer.js')

router.get('/', getAllStudent)

router.post('/login', Login)
module.exports = router 