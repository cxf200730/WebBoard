const db = require('../config/db.js')

class teacherModel {
	//查找所有
	findAll(){
		return db.query( 'select * from teacher ', [])
	}

	//添加老师(注册)
	addTeacher(body){
		const sql = 
		"insert into teacher(name,phone,password,totalexam) values ('"
		+ body.name + "','" + body.phone + "','" + body.password + "','" + body.totalexam + "')"
		return db.query( sql, [])
	}

	//添加试卷
	addExam(body){
		const phone = body.phone
		const sql = "UPDATE teacher SET totalexam = totalexam + 1 WHERE phone = '" + phone + "'"
		return db.query( sql, [])
	}

	//登录
	Login(body){
		const sql = "select * from teacher where phone = '" + body.phone + "' and password = '" + body.password + "'"
		return db.query( sql, [])
	}

	//获取自己拥有的试卷
	getMyExam(body){
		const sql = "select * from teacher left join exam on teacher.phone = exam.teacher_phone where phone = '" + body.phone + "'"
		
		return db.query( sql, [])
	}

}

module.exports = new teacherModel()