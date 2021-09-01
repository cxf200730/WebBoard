const db = require('../config/db.js')

class examModel {
	//查找所有
	findAll(){
		return db.query( 'select * from exam order by id ASC', [])
	}
    addTopic(body){
        const code = "1001"
        const title = "第一次测试"
        const topic_index = body.topic_index
        const topic_content = JSON.stringify(body.topic_content)
        const sql = "insert into exam (code,title,topic_index,topic_content) values('1001','第一次测试','" + topic_index +"','" + topic_content + "')"
        return db.query( sql, [])
    }
}

module.exports = new examModel()