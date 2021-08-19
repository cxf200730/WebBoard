// const teacherModel = require('../model/teacherModel.js')
// class teacherServer {
	
// 	async getExam( req, res, next){
// 		const { results } = await teacherModel.findAll()
// 		res.json({ err_code: 0,  message: results})
// 	}
	
// 	async addExam( req, res, next){
// 		const body = req.body;
// 		const { results } = await teacherModel.addExam(body)
// 		res.json({ err_code: 0,  message: results})
		
		
// 	}
// 	async addTopic( req, res, next){
// 		const body = req.body;
// 		const { results } = await teacherModel.addTopic(body)
// 		res.json({ err_code: 0,  message: results})
		
		
// 	}

	
// }

// module.exports = new teacherServer()