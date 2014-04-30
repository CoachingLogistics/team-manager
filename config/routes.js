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
	var carpools = require('../app/controllers/carpools');
	var riders = require('../app/controllers/riders');

	var mail = require('../app/controllers/mail');
	var attendances = require('../app/controllers/attendances');

	//home stuff
	app.get('/', home.index);
	app.get('/404', home.err);


	//users
	app.get('/account', ensureAuthenticated, users.account);
	app.get('/users/:id', users.show);
	app.get('/register', users.registration);
	app.post('/register', users.register);
	app.get('/login', users.signin);
	app.post('/login', users.login);
	app.get('/logout', users.logout);
	app.post('/users/:id/delete', ensureAuthenticated, users.delete);
	app.get('/users/:id/edit', ensureAuthenticated, users.edit);
	app.post('/users/:id/edit', ensureAuthenticated, users.update);
	app.get('/forget', users.forget);
	app.post('/forget', users.remember);
	app.get('/users/:id/password-change', ensureAuthenticated, users.password_form);
	app.post('/users/:id/password-change', ensureAuthenticated, users.password_change);

	//AJAX
	app.get('/users/:id/info', users.user_info);

	app.get('/users', users.index);	//to be removed in production

	// players
	app.get('/players', players.index);
	app.get('/players/new', ensureAuthenticated, players.new_player);
	app.post('/players/new', ensureAuthenticated, players.create_player);
	app.get('/players/:id', players.show);//to be removed
	app.get('/players/:id/edit', ensureAuthenticated, players.edit);
	app.post('/players/:id/update', ensureAuthenticated, players.update);
	app.post('/players/:id/delete', ensureAuthenticated, players.delete);
	app.get('/players/:id/addUser', ensureAuthenticated, players.addUser);
	app.post('/players/:id/addUser', ensureAuthenticated, players.createNewFamily);

	//AJAX
	app.get('/players/:id/teams', players.teams);//auth?

	// teams
	app.get('/teams', ensureAuthenticated, teams.index);
	app.get('/teams/new', ensureAuthenticated, teams.new);
	app.post('/teams/new', ensureAuthenticated, teams.create);
	app.get('/teams/:id', teams.show);
	app.get('/teams/:id/edit', ensureAuthenticated, teams.edit);
	app.post('/teams/:id/edit', ensureAuthenticated, teams.update);
	//app.post('/teams/:id/delete', teams.delete);
	app.get('/teams/:id/calendar_events', teams.calendar_events);

	app.get('/teams/:id/event', ensureAuthenticated, events.team_event);
	app.get('/teams/:id/calendar', teams.calendar);
	app.get('/teams/:id/roster', ensureAuthenticated, teams.roster);	//further auth?????


	// events
	app.get('/events', ensureAuthenticated, events.index);
	app.get('/events/:id', events.show);
	app.get('/events/new', ensureAuthenticated, events.new);
	app.post('/events/new', ensureAuthenticated, events.create);
	app.get('/events/:id/edit', ensureAuthenticated, events.edit);
	app.post('/events/:id/edit', ensureAuthenticated, events.update);
	app.post('/events/:id/delete', ensureAuthenticated, events.delete);

	//event AJAX
	app.get('/teams/:team_id/next_event', events.next_event);	//auth????
	app.get('/events/:id/coordinates', events.coordinates);

	//attendance AJAX
	app.get('/events/:event_id/players/:player_id/attendance', events.attendance);	//auth??

	// email AJAX
	app.get('/players/:player_id/:event_id/guardians', attendances.guardianResponse);	//auth??

	// mailer
	app.get('/mail/compose', mail.compose_mail);	//authentication?
	app.post('/mail/test', mail.test);		//authentication?

	// email templates
	app.get('/teams/:id/templates/new', ensureAuthenticated, email_templates.new);	//authentication? only coaches?
	app.post('/teams/:id/templates/new', ensureAuthenticated, email_templates.create);
	app.get('/teams/:id/templates', ensureAuthenticated, email_templates.index);
	app.get('/teams/:id/templates/:temp_id', ensureAuthenticated, email_templates.show);
	app.post('/teams/:id/templates/:temp_id/delete', ensureAuthenticated, email_templates.delete);
	app.get('/teams/:id/templates/:temp_id/edit', ensureAuthenticated, email_templates.edit);
	app.post('/teams/:id/templates/:temp_id/update', ensureAuthenticated, email_templates.update);

	//filling the roster
	app.get('/teams/:id/roster-fill', ensureAuthenticated, teams.roster_fill);
	app.post('/teams/:id/roster-create', ensureAuthenticated, teams.roster_create);
	app.post('/teams/:team_id/players/:player_id/remove', ensureAuthenticated, roster_spots.deleteByIds);

	//coach
	app.post('/teams/:team_id/user/:user_id/remove', ensureAuthenticated, coaches.deleteByIds);

	//family
	app.post('/family/new',  ensureAuthenticated, families.new);	//tbd?
	app.post('/family/:id/delete',  ensureAuthenticated, families.delete);	//is this used in prod??
	app.get('/families', families.index);		//to be removed in production

	// attendance
	app.get('/attendance/:attendanceid/:response', attendances.record_response);			//do we want auth for any of these??
	app.get('/attendanceRemind/:event_id/:player_id', attendances.send_email);
	app.get('/attendanceUpdate/:event_id/:player_id/:response', attendances.web_update);	//
	app.post('/emailAll/:event_id', ensureAuthenticated, attendances.email_all);

	//carpools
	app.get('/events/:event_id/carpools/new', ensureAuthenticated, carpools.new);
	app.post('/carpools/new', ensureAuthenticated, carpools.create);
	app.get('/carpools/:id', carpools.show);

	app.get('/carpools/:id/edit', ensureAuthenticated, carpools.edit);
	app.post('/carpools/:id/edit', ensureAuthenticated, carpools.update);
	app.get('/carpools/:id/addRider', ensureAuthenticated, carpools.addRider);

	app.post('/carpools/:id/delete', ensureAuthenticated, carpools.delete);


	//AJAX
	app.get('/carpools/:id/routing', carpools.routing);
	app.get('/carpools/:id/riders', carpools.riders);

	app.get('/riders', riders.index);
	app.post('/riders/createForCarpool/:carpool_id', riders.create);	//what is auth logic here?, coach and parents?  if so check out carpools.create

	app.get('/riders/:event_id/riderequest', riders.request);			//auth logic here?
	app.get('/riders/:event_id/request/:carpool_id', riders.requestForCarpool);
	app.post("/riders/:event_id/request/:carpool_id", riders.createRequestForCarpool);
	app.get('/events/:event_id/rideRequest', ensureAuthenticated, riders.rideRequestForEvent);
	app.post('/events/:event_id/rideRequest', ensureAuthenticated, riders.submitRideRequestForEvent);
	app.get('/riders/confirm/:carpool_id/:player_id', ensureAuthenticated, riders.confirmForCarpool);
	app.get('/events/:event_id/pickupPlayer/:player_id', ensureAuthenticated, riders.pickupPlayer);
	app.get("/riders/remove/:carpool_id/:player_id", ensureAuthenticated, riders.removeRider);

	// from the email so they won't be logged in.. king of hacky for now but it is what it is
	app.get('/riders/confirm/:carpool_id/:player_id/email', riders.confirmForCarpool);



	//
	app.get('*', home.err);
};


//used to make sure the user is logged in to access a route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
