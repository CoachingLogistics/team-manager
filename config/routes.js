module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var teams = require('../app/controllers/teams');
	var users = require('../app/controllers/users');
	var players = require('../app/controllers/players');
	var families = require('../app/controllers/families');

	var mail = require('../app/controllers/mail');

	//home stuff
	app.get('/', home.index);
	app.get('/404', home.err);


	//users
	app.get('/account', ensureAuthenticated, users.account);
	app.get('/users/:id', users.show)
	app.get('/register', users.registration);
	app.post('/register', users.register);
	app.get('/login', users.signin);
	app.post('/login', users.login);
	app.get('/logout', users.logout);
	app.post('/users/:id/delete', users.delete);
	app.get('/users/:id/edit', ensureAuthenticated, users.edit);
	app.post('/user/:id/edit', users.update);
	app.get('/users', users.index);	//to be removed in production

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
	
	// mailer
	app.get('/mail/compose', mail.compose_mail);
	app.post('/mail/send', mail.send_mail);


	//filling the roster
	app.get('/teams/:id/roster-fill', teams.roster_fill);
	app.post('/teams/:id/roster-create', teams.roster_create);

	//family
	app.post('/family/new', families.new);
	app.post('/family/:id/delete', families.delete);
	app.get('/families', families.index);		//to be removed in production


	//
	app.get('*', home.err);
};


//used to make sure the user is logged in to access a route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
