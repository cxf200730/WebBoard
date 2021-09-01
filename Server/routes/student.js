const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const {getAllStudent, Login, Join, getExam,saveExam, saveTopic, getTopic, 
    updateTopic, updateTopic2} = require('../service/studentServer.js')

router.get('/', getAllStudent)
router.post('/getexam', getExam)
router.post('/saveexam', saveExam)

router.post('/savetopic', saveTopic)
router.post('/gettopic', getTopic)
router.post('/updatetopic', updateTopic)
router.post('/updatetopic2', updateTopic2)
router.post('/login', Login)
router.post('/join', Join)
module.exports = router 