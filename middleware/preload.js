//TODO replace with actual service
const secondService = require('../services/secondService');

function preload(){
	return async function(req, res, next) {
		const id =req.params.id;
		//TODO change property name to match collection
		const data = await secondService.getPostById(id);
		res.locals.data = data;
		next();
	};
}


module.exports = preload;