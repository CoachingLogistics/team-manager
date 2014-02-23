module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var teams = require('../app/controllers/teams');
	app.get('/', home.index);
	app.get('/teams', teams.index);

};
