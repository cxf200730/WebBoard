const db = require('../config/db.js')

class studentModel {
	//查找所有
	findAll(){
		return db.query( 'select * from student ', [])
	}

	//登录
	Login(body){
		const sql = "select * from student where code = '" + body.phone + "' and password = '" + body.password + "'"
		return db.query( sql, [])
	}

	//加入班级
	Join(body){
		const sql = "select * from classInfo where classcode = '" + body.classcode + "' and studentcode = '" + body.studentcode + "'"
		return db.query( sql, [])
	}

}

module.exports = new studentModel()