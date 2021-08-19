// const db = require('../config/db.js')

// class teacherModel {
// 	//查找所有
// 	findAll(){
// 		return db.query( 'select * from exam1604 order by id ASC', [])
// 	}

// 	addTopic(body){
// 		var id = body.id;
// 		var ismust = body.ismust;
// 		var imgsrc = body.imgsrc;
// 		var answer = body.answer;
// 		var score = body.score;
// 		var count = body.count;
// 		const sql = "insert into exam" + body.table + "(id,ismust,imgsrc, answer, score, count) values("  + id  + "," + ismust + "," + "'" + imgsrc + "'" + "," + answer+ "," + score +"," + count +  ")"
// 		console.log(sql)
// 		return db.query( sql, [body])
// 	}

// 	addExam(body){
// 		const sql = "CREATE TABLE exam"  + body.id  +  "(id int,ismust varchar(255),imgsrc varchar(255),answer varchar(255),score varchar(255),count varchar(255))"
// 		console.log(sql)
// 		return db.query( sql, [body])
// 	}
// }

// module.exports = new teacherModel()