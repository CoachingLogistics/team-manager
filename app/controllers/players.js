/*
 * Players controller
 *
 */
var mongoose = require('mongoose'),
  Player = mongoose.model('Player');
var Family = mongoose.model('Family');
var Team = mongoose.model('Team');
var RosterSpot = mongoose.model('RosterSpot');

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
			res.status(404).render("404", {user:req.user});
		}
		else {

			//
			//p.getTeams(function(teams){
				res.render('player/show', {
					player: p,
					//teams: teams,
					user: req.user
				});
			//});
		};
	});
}

/*
 * Player edit page
 */
exports.edit = function(req, res) {
	Player.findById(req.params.id, function(err, p) {
		if(err) {
			res.status(404).render("404", {user:req.user});
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

			//delete dependent roster spots/attendances/families?

			return res.redirect('/players');
		}
	});
}

/*
 * Renders a page to let a user add another use to for a player
 */
exports.addUser = function(req, res) {
  Player.findById(req.params.id, function(err, foundPlayer) {
    res.render('player/addUser', {user: req.user, player: foundPlayer});
  });
}

exports.createNewFamily = function(req, res) {
  // making variables from request that are easier to access
  var player_id = req.params.id;
  var email = req.body.email;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var phone = req.body.phone;
  // attempt to find the user
  User.find({'email': email}, function(err, docs) {
    if(docs.length == 0) {
      // user email does not exist
      // generate random password for a new user
      var random_password = User.generateRandomPassword();
      console.log(random_password);
      var newUser = new User({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone': phone,
        'password': random_password
      });
      // create the new user and family
      newUser.save(function(err, savedUser) {
        if(err) {
          // redirect them back if there is a validation problem
          return res.redirect('back');
        }
        var newFamily = new Family({
          'user_id': savedUser._id,
          'player_id': player_id
        });
        newFamily.save(function(err, savedFamily) {
          if(err) {
            // redirect back if there is a problem
            return redirect('back');
          }

          res.redirect('/users/' + savedUser._id);
        });
      });
    }
    else {
      // user email does exist
      var user = docs[0];
      var newFamily = new Family({
        'user_id': user._id,
        'player_id': player_id
      });
      // save the new family with the found user and player
      newFamily.save(function(err, savedFamily) {
        res.redirect('/players/' + player_id);
      });
    }
  });
}

//AJAX ONLY
exports.teams = function(req, res){
	RosterSpot.getTeamsForPlayer(req.params.id, function(teams){
		res.send(teams);
	})

}
