const mysql = require('mysql')
const dbConfig = require('./db.config.js')
module.exports = {
	query(sql, params){
		return new Promise((resolve, reject) => {
			//1.创建mysql连接对象
			const connection = mysql.createConnection(dbConfig)
			//2.开启连接
			connection.connect(err => {
				if(err) {
					console.log('数据库连接失败')
					reject(err)
				}
				console.log('数据库连接成功')
			})
			//3.执行sql查询语句
			connection.query(sql, params, (err, results, fileds) => {
				if(err) {
					console.log('数据库操作失败')
					reject(err)
				}
				// callback && callback(results, fileds)
				resolve({
					results,
					fileds
				})
			})
			//4.关闭连接
			connection.end(err => {
				if(err) {
					console.log('数据库关闭失败')
					reject(err)
				}
				console.log('数据库关闭成功')
			})
		})
	}
}
