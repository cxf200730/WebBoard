const studentModel = require('../model/studentModel.js')
class studentServer {
	
	async getAllStudent( req, res, next){
		const { results } = await studentModel.findAll()
		res.json({ err_code: 0,  message: results})
	}
	async getExam( req, res, next){
		console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.getExam(body)
		res.json({ err_code: 0,  message: results})
	}
	async getTopic( req, res, next){
		// console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.getTopic(body)
		res.json({ err_code: 0,  message: results})
	}
	async updateTopic( req, res, next){
		// console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.updateTopic(body)
		res.json({ err_code: 0,  message: results})
	}
	async updateTopic2( req, res, next){
		// console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.updateTopic2(body)
		res.json({ err_code: 0,  message: results})
	}
	async saveExam( req, res, next){
		console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.saveExam(body)
		res.json({ err_code: 0,  message: results})
	}
	async saveTopic( req, res, next){
		console.log(req.body);
		const body = req.body;
		const { results } = await studentModel.saveTopic(body)
		res.json({ err_code: 0,  message: results})
	}
	async Login( req, res, next){
		const body = req.query;
		const { results } = await studentModel.Login(body)
		res.json({ err_code: 0,  message: results})
	}
	async Join( req, res, next){
		const body = req.query;
		const { results } = await studentModel.Join(body)
		res.json({ err_code: 0,  message: results})
	}
	
}

module.exports = new studentServer()