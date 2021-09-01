const db = require('../config/db.js')

class studentModel {
	//查找所有
	findAll(){
		return db.query( 'select * from student ', [])
	}
	//保存笔迹
	saveExam(body){
		const answer = JSON.stringify(body.answer)
		const code = body.id
		console.log(answer);
		const sql = "update student set answer = '" + answer + "' where code = '" + code + "'"
		return db.query( sql, [])
	}
	//学生答题保存笔迹
	saveTopic(body){
		const stucode = body.stucode
		const room = body.room
		const exam_code = body.exam_code
		const topic_index = body.topic_index
		const stuanswer = JSON.stringify(body.stuanswer)
		// const update_answer = body.update_answer || null
		const fintime = body.fintime
		const sql = "insert into stuexam(stucode,room,exam_code,topic_index,stuanswer,fintime) values" +
		"('" + stucode + "','" +room + "','" + exam_code +"','" + topic_index +"','" + 
		stuanswer  + "','" + fintime +"')"
		return db.query( sql, [])
	}
	//获取题目
	getTopic(body){
		const stucode = body.stucode
		console.log(stucode);
		const sql = "SELECT * from stuexam where stucode = '" + stucode + "'"
		return db.query( sql, [])
	}
	//添加答题内容
	updateTopic(body){
		console.log(body);
		const stucode = body.stucode
		const room = body.room
		const exam_code = body.exam_code
		const topic_index = body.topic_index
		const stuanswer = body.stuanswer
		// console.log(stucode);
		const sql = "SELECT * from stuexam where stucode = '" + stucode +
		"' and room = '" + room + "' and exam_code = '" + exam_code + "' and topic_index = '" + 
		topic_index + "'"
		return db.query( sql, [])
	}
	//添加答题内容
	updateTopic2(body){
		console.log(body);
		const stucode = body.stucode
		const room = body.room
		const exam_code = body.exam_code
		const topic_index = body.topic_index
		const stuanswer = JSON.stringify(body.stuanswer)
		// console.log(stucode);
		const sql = "update stuexam set stuanswer = '" + stuanswer + "' where stucode = '" + stucode + "' and topic_index = '" + topic_index + "'" 
		return db.query( sql, [])
	}
	//获取试卷
	getExam(body){
		const code = body.id
		const sql = "SELECT * from student where code = '" + code + "'"
		return db.query( sql, [])
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