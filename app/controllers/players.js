/*
 * Players controller
 *
 */
var mongoose = require('mongoose'),
  Player = mongoose.model('Player');

/*
 * Function for the players index page
 * sends all of the players to players/index.ejs
 */
exports.index = function(req, res) {
	Player.find(function(err, players) {
		res.render("player/index", {
			'players': players
		});
	});
}

/*
 * renders a page for a new player
 */
exports.new_player = function(req, res) {
	res.render("player/new");
}

/*
 * attemps to insert a new player
 */
exports.create_player = function(req, res) {
	// kind of placeholder for now, may change the name of the params
	// when writing 'new.ejs'
	console.log(JSON.stringify(req.body));
	var player = new Player({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		date_of_birth: req.body.dob
	});
	player.save(function(err, created_object) {
		if(err) {
			res.render('player/new', {
				error: "Missing required fields"
			});
		}
		else {
			return res.redirect("/players");
		}
	});
}

/*
 * Player show page
 */
exports.show = function(req, res) {
	// will make this do more when we get more added
	res.render('player/show');
}