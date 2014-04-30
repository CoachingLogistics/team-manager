/*
 * Players controller
 *
 */
var mongoose = require('mongoose'),
  Player = mongoose.model('Player');
var Family = mongoose.model('Family');
var Team = mongoose.model('Team');
var RosterSpot = mongoose.model('RosterSpot');
var user_added_mailer = require('../mailers/user_added_for_player');
var Attendance = mongoose.model('Attendance');
/*
 * Function for the players index page
 * sends all of the players to players/index.ejs
 */
 //not used in production
exports.index = function(req, res) {
	Player.find(function(err, players) {
		res.render("player/index", {
      title: "Players",
			'players': players,
			user: req.user
		});
	});
}



/*
 * renders a page for a new player
 */
//functional yet?
exports.new_player = function(req, res) {
	res.render("player/new", {
    title: "New Player",
		user: req.user
	});
}




/*
 * attemps to insert a new player
 */
//post
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
        title: "New User",
				user: req.user
			});
		}
		else {
      if(req.user) {
        var newFamily = new Family({'user_id': req.user._id, 'player_id': created_object._id});
        newFamily.save(function(err, savedFamily) {
          // if this results in an error the family won't be created and it'll redirect to players anyway
          return res.redirect('/players');
        });
      }
      else {
  			return res.redirect("/players");
      }
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

			//teams loaded in via page AJAX
      if (p.date_of_birth){
        var dob = dateFormat(p.date_of_birth);  
      } 

				res.render('player/show', {
          title: p.first_name + " " + p.last_name,
					player: p,
          dob: dob,
					user: req.user
				});
		};
	});
}



/*
 * Player edit page
 */
exports.edit = function(req, res) {

  Family.getUserIdsForPlayer(req.params.id, function(user_ids){ //checks if req.user is a parent
    var access=false;

    user_ids.forEach(function(p){ //check to see if the user is parent
      if(req.user._id.equals(p)){
        access = true;
      }
    });

    if(!access){
      //not authorized
      res.redirect('/')
    };

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
          title: "Edit Player",
          player: p,
          dobStr: dateRFCFormat(p.date_of_birth),
          error: null,
          user: req.user
        });
      }
    })


  })//family
};



/*
 * Attempts to update a player
 */

 //post
exports.update = function(req, res) {
  Family.getUserIdsForPlayer(req.params.id, function(user_ids){ //checks if req.user is a parent
    var access=false;

    user_ids.forEach(function(p){ //check to see if the user is parent
      if(req.user._id.equals(p)){
        access = true;
      }
    });

    if(!access){
      //not authorized
      res.redirect('/')
    };

  	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
  	var d = new Date(date_string);
  	Player.findById(req.params.id, function(err, the_player) {

  		the_player.first_name = req.body.first_name;
  		the_player.last_name = req.body.last_name;
  		the_player.date_of_birth = d;

  		the_player.save(function(err, saved_player) {
  			if(err || !req.body.year) {
            console.log(err);
            res.redirect('back');
  			}
  			else {
  				return res.redirect('/players/' + req.params.id);
  			}
  		});
  	});
  });//family
}




/*
 * attempts to delete player
 */

exports.delete = function(req, res) {
    Family.getUserIdsForPlayer(req.params.id, function(user_ids){ //checks if req.user is a parent
    var access=false;

    user_ids.forEach(function(p){ //check to see if the user is parent
      if(req.user._id.equals(p)){
        access = true;
      }
    });

    if(!access){
      //not authorized
      res.redirect('/')
    };

  	Player.remove({_id: req.params.id}, function(err, docs) {
  		if(err) {
  			return res.redirect('back');
  		}
  		else {

  			//delete dependent roster spots/attendances/families?

  			return res.redirect('back');
  		}
  	});
  });//family
}




/*
 * Renders a page to let a user add another use to for a player
 */
//get
exports.addUser = function(req, res) {
  Family.getUserIdsForPlayer(req.params.id, function(user_ids){ //checks if req.user is a parent
    var access=false;

    user_ids.forEach(function(p){ //check to see if the user is parent
      if(req.user._id.equals(p)){
        access = true;
      }
    });

    if(!access){
      //not authorized
      res.redirect('/')
    };
    Player.findById(req.params.id, function(err, foundPlayer) {
      res.render('player/addUser', {title: "Add Guardian for " + foundPlayer.first_name, user: req.user, player: foundPlayer, notice: undefined});
    });
  });//family
}


//post for the above get
exports.createNewFamily = function(req, res) {
  Family.getUserIdsForPlayer(req.params.id, function(user_ids){ //checks if req.user is a parent
    var access=false;

    user_ids.forEach(function(p){ //check to see if the user is parent
      if(req.user._id.equals(p)){
        access = true;
      }
    });

    if(!access){
      //not authorized
      res.redirect('/')
    };
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
            Player.findById(player_id, function(pfbid_error, thePlayer) {
              if(pfbid_error) {
                return res.redirect('back');
              }
              else {
                user_added_mailer.newUserCreated(savedUser, random_password, req.user, thePlayer, function(err, message) {
                  if(err) {
                    //email failed to send, but everything else worked, so not really an issue
                  }
                  return
                });
                return res.redirect('/users/' + savedUser._id);
              }
            });
          });
        });
      }
      else {
        // user email does exist
        var user = docs[0];
        // make sure the user is not already a part of a family
        Family.find({'user_id': user._id, 'player_id': player_id}, function(famErr, famDocs) {
          if(famDocs.length == 0) {
            var newFamily = new Family({
              'user_id': user._id,
              'player_id': player_id
            });
            // save the new family with the found user and player
            newFamily.save(function(err, savedFamily) {
              Player.findById(player_id, function(err, thePlayer) {
                if(err) {
                  return res.redirect('back');
                }
                else {
                  user_added_mailer.emailExistingUser(user, req.user, thePlayer, function(mail_error) {
                    if(mail_error) {
                      // doesn't really matter
                    }
                    return res.redirect('/players/' + player_id);
                  });
                }
              });
            });
          }
          else {
            // user is already a parent
            Player.findById(player_id, function(err, foundPlayer) {
              res.render('player/addUser', {title: "Add Guardian for " + foundPlayer.first_name, user: req.user, player: foundPlayer, notice: "Email is already associated with this player"});
            });
          }
        });
      }
    });
  });//family
}


//AJAX ONLY
//returns the teams for a given player_id
exports.teams = function(req, res){
	RosterSpot.getTeamsForPlayer(req.params.id, function(teams){
		res.send(teams);
	})

}


//helpers
var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

var dateRFCFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    if (day < 10){
      day = "0" + day;
    }
    if (month < 10){
      month = "0" + month;
    }
    return year+"-"+month+"-"+day;
};

var timeFormat = function(date) {
    var time = "AM";
  var hour = date.getHours();
  if( date.getHours()>=12){
    if(date.getHours()>12){
      hour =  date.getHours()-12;
    }else{
      hour = 12;
    }

    time="PM";
  }

  var minutes = date.getMinutes();
  if(date.getMinutes() == 0){
    minutes = "00";
  }

  return hour+":"+minutes+" "+time;
};
