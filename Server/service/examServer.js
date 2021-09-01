const examModel = require('../model/examModel.js')
class examServer {
	
	async getExam( req, res, next){
		const { results } = await examModel.findAll()
		res.json({ err_code: 0,  message: results})
	}
	async addTopic( req, res, next){
        const body = req.body
		const { results } = await examModel.addTopic(body)
		res.json({ err_code: 0,  message: results})
	}
}

module.exports = new examServer()