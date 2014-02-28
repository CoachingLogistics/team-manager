module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var events = require('../app/controllers/events')
	var teams = require('../app/controllers/teams');
	var users = require('../app/controllers/users');
	var players = require('../app/controllers/players');

	var mail = require('../app/controllers/mail');
	app.get('/', home.index);


	//users
	app.get('/account', users.account);
	app.get('/user/:id', users.show)
	app.get('/register', users.registration);
	app.post('/register', users.register);
	app.get('/login', users.signin);
	app.post('/login', users.login);
	app.get('/logout', users.logout);
	app.post('/user/:id/delete', users.delete);
	app.get('/user/:id/edit', users.edit);
	app.post('/user/:id/edit', users.update);

	// players
	app.get('/players', players.index);
	app.get('/players/new', players.new_player);
	app.post('/players/new', players.create_player);
	app.get('/players/:id', players.show);
	app.get('/players/:id/edit', players.edit);
	app.post('/players/:id/update', players.update);
	app.post('/players/:id/delete', players.delete);

	// teams
	app.get('/teams', teams.index);
	app.get('/teams/new', teams.new);
	app.post('/teams/new', teams.create);
	app.get('/teams/:id', teams.show);
	app.get('/teams/:id/edit', teams.edit);
	app.post('/teams/:id/edit', teams.update);
	//app.post('/teams/:id/delete', teams.delete);

	// events
	app.get('/events', events.index);
	app.get('/events/new', events.new);
	app.post('/events/new', events.create);
	app.get('/events/:id', events.show);
	app.get('/events/:id/edit', events.edit);
	app.post('/events/:id/edit', events.update);
	app.post('/events/:id/delete', events.delete);
	
	// mailer
	app.get('/mail/compose', mail.compose_mail);
	app.post('/mail/send', mail.send_mail);
};


//used to authenticate views
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
