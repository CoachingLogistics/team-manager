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
			'players': players,
			user: req.user
		});
	});
}

/*
 * renders a page for a new player
 */
exports.new_player = function(req, res) {
	res.render("player/new", {
		user: req.user
	});
}

/*
 * attemps to insert a new player
 */
exports.create_player = function(req, res) {
	// kind of placeholder for now, may change the name of the params
	// when writing 'new.ejs'
	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
	var player = new Player({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		date_of_birth: new Date(date_string)
	});
	player.save(function(err, created_object) {
		if(err) {
			res.render('player/new', {
				error: "Missing required fields",
				user: req.user
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
	Player.findById(req.params.id, function(err, p) {
		if(err) {
			res.redirect('/404');
		}
		else {
			res.render('player/show', {
				player: p,
				user: req.user
			});
		}
	});
}

/*
 * Player edit page
 */
exports.edit = function(req, res) {
	Player.findById(req.params.id, function(err, p) {
		if(err) {
			res.redirect('/404');
		}
		else {
			var month_name;
			if(p.date_of_birth) {
				var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				month_name = monthNames[p.date_of_birth.getMonth()];
			}
			return res.render('player/edit', {
				player: p,
				month: month_name,
				error: null,
				user: req.user
			});
		}
	})
}

/*
 * Attempts to update a player
 */
exports.update = function(req, res) {
	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
	var d = new Date(date_string);
	Player.findById(req.params.id, function(err, the_player) {
		var saved_fname = the_player.first_name;
		var saved_lname = the_player.last_name;
		var saved_dob = the_player.date_of_birth;
		the_player.first_name = req.body.first_name;
		the_player.last_name = req.body.last_name;
		the_player.date_of_birth = d;
		the_player.save(function(err, saved_player) {
			if(err || !req.body.year) {
				the_player.first_name = saved_fname;
				the_player.last_name = saved_lname;
				the_player.date_of_birth = saved_dob;
				var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				var month_name = monthNames[the_player.date_of_birth.getMonth()];
				return res.render('player/edit', {
					player: the_player,
					month: month_name, 
					error: "Must include first and last names",
					user: req.user
				});
			}
			else {
				return res.redirect('/players/' + req.params.id);
			}
		});
	});
}

/*
 * attempts to delete player
 */
exports.delete = function(req, res) {
	Player.remove({_id: req.params.id}, function(err, docs) {
		if(err) {
			return res.redirect('/players/' + req.params.id);
		}
		else {
			return res.redirect('/players');
		}
	});
}