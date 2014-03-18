module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	var events = require('../app/controllers/events')
	var teams = require('../app/controllers/teams');
	var users = require('../app/controllers/users');
	var players = require('../app/controllers/players');
	var email_templates = require('../app/controllers/email_templates');
	var families = require('../app/controllers/families');
	var roster_spots = require('../app/controllers/roster_spots');
	var coaches = require('../app/controllers/coaches');

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
	app.post('/users/:id/edit', users.update);
	app.get('/forget', users.forget);
	app.post('/forget', users.remember);
	app.get('/users/:id/password-change', users.password_form);
	app.post('/users/:id/password-change', users.password_change);
	app.get('/users', users.index);	//to be removed in production

	// players
	app.get('/players', players.index);
	app.get('/players/new', players.new_player);
	app.post('/players/new', players.create_player);
	app.get('/players/:id', players.show);
	app.get('/players/:id/edit', players.edit);
	app.post('/players/:id/update', players.update);
	app.post('/players/:id/delete', players.delete);

	app.get('/players/:id/teams', players.teams);

	// teams
	app.get('/teams', teams.index);
	app.get('/teams/new', teams.new);
	app.post('/teams/new', teams.create);
	app.get('/teams/:id', teams.show);
	app.get('/teams/:id/edit', teams.edit);
	app.post('/teams/:id/edit', teams.update);
	//app.post('/teams/:id/delete', teams.delete);
	app.get('/teams/:id/event', events.team_event);
	app.get('/teams/:id/calendar', teams.calendar);
	app.get('/teams/:id/roster', teams.roster);


	// events
	app.get('/events', events.index);
	app.get('/events/new', events.new);
	app.post('/events/new', events.create);
	app.get('/events/:id', events.show);
	app.get('/events/:id/edit', events.edit);
	app.post('/events/:id/edit', events.update);
	app.post('/events/:id/delete', events.delete);

	//attendance
	app.get('/events/:event_id/players/:player_id/attendance', events.attendance)
	
	// mailer
	app.get('/mail/compose', mail.compose_mail);
	app.post('/mail/test', mail.test);

	// email templates
	app.get('/teams/:id/templates/new', email_templates.new);
	app.post('/teams/:id/templates/new', email_templates.create);
	app.get('/teams/:id/templates', email_templates.index);
	app.get('/teams/:id/templates/:temp_id', email_templates.show);
	app.post('/teams/:id/templates/:temp_id/delete', email_templates.delete);
	app.get('/teams/:id/templates/:temp_id/edit', email_templates.edit);
	app.post('/teams/:id/templates/:temp_id/update', email_templates.update);

	//filling the roster
	app.get('/teams/:id/roster-fill', teams.roster_fill);
	app.post('/teams/:id/roster-create', teams.roster_create);
	app.post('/teams/:team_id/players/:player_id/remove', roster_spots.deleteByIds)

	//coach
	app.post('/teams/:team_id/user/:user_id/remove', coaches.deleteByIds)

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
