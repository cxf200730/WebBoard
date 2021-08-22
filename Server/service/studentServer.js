const studentModel = require('../model/studentModel.js')
class studentServer {
	
	async getAllStudent( req, res, next){
		const { results } = await studentModel.findAll()
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