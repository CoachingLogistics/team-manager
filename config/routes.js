module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var events = require('../app/controllers/events')

	app.get('/', home.index);

	app.get('/events', events.index);
	app.get('/events/new', events.new);
	app.post('/events/new', events.create);
};
