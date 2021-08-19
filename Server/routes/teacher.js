const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { getAllTeacher, addTeacher,Login, getMyExam, addExam  } = require('../service/teacherServer.js')

router.get('/', getAllTeacher)

router.post('/getmyexam', getMyExam)

router.post('/addexam', addExam)

router.post('/add', addTeacher)
router.post('/login', Login)
module.exports = router 