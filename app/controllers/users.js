var mongoose = require('mongoose'),
  User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;
var Family = mongoose.model('Family');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var Coach = mongoose.model('Coach');
var ForgottenEmail = require('../mailers/forgotten_email');


//like a show page, except with editing options and personal info about players, teams
//only a user can access their own account page
exports.account = function(req, res){	//test non-access?

	Coach.getTeamsForUser(req.user._id, function(err, teams){
		Family.getPlayersForUser(req.user._id, function(players){

			res.render('user/account', {
				user: req.user,
			  	title: 'My Account',
			  	players: players,
			  	teams: teams
			});

		});
	});
};


//not used in production
exports.index = function(req, res){			//delete this later
	User.find({}, function(error, users) {

		res.render('user/index', {
			title: "All Users",
			user: req.user,
			users: users
		});
	});
};


//should limit the information shown on this page
exports.show = function(req, res){
	User.findById(req.params.id, function(error, user) {
		Family.getPlayersForUser(user._id, function(players){

			res.render('user/show', {
				title: "User Details",
				user: req.user,
				user_show: user,
			  	players: players
			});

		});
	});
};

//get for new users
exports.registration = function(req, res){
	res.render('user/register', {
		user: req.user,
	  	title: 'Register',
	  	message: req.session.messages
	});
};

//post, creates new user
exports.register = function(req, res){
	var newUser = new User({
		email: req.param('email'),
		first_name: req.param('first_name'),
		last_name: req.param('last_name'),
		password: req.param('password'),
		phone: req.param('phone')
	});

	newUser.save(function(err, user){
		if(err){
			console.log(err);
			return res.render('user/register', {
				user: req.user,
				title: 'Register',
				message: err
			});
		}
    req.logIn(user, function(err) {
      if(err) {
        console.log(err);
        return res.render('user/register', {
          user: req.user,
          title: 'Registration',
          message: 'registration unsuccessful'
        });
      }
      return res.redirect('/');
    });
	});
};

//login page
exports.signin = function(req, res){
  if(req.user) {
    return res.redirect('/');
  }
	res.render('user/login', {
		user: req.user,
		title: 'Login',
	  	message: req.session.messages
	});
};

//post
//passport login function
exports.login = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {

    if (err) { return next(err) }
    if (!user) {
    	console.log(info.message);
      req.session.messages =  "Invalid email address or password";
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('back');
    });
  })(req, res, next);
};


//get
//passport logout function
exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};


//get
exports.edit = function(req, res){		//ONLY A PERSON CAN EDIT THEIR OWN ACCOUNT
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}
	
		res.render('user/edit', {
			user: req.user,
			title: 'Edit User',
		  	message: req.session.messages
		  	//MORE STUFF
		});

};

//post
exports.update = function(req, res){
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

		User.findById(req.params.id, function(err, user){
			user.email = req.param('email');
			user.first_name = req.param('first_name');
			user.last_name = req.param('last_name');
			user.phone = req.param('phone');
			//user.password = req.param('password');
			user.save(function(err, user){
				if(err){
					console.log(err);
					res.redirect('/404');
				}
				res.redirect('/account');
			});

		});


};


//need to check dependencies
exports.delete = function(req, res){
  	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

    User.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		res.redirect('/users/'+req.params.id);
    	}

      //delete dependent families/coaches?

      res.redirect('/');
    });

};


//the "forgot my password" page
exports.forget = function(req, res){
  	res.render('user/forget', {
  		title: "Forget Password",
		user: req.user,
		message: req.session.messages
	});
};

//post for the above page
exports.remember = function(req, res){
  	var email = req.param('email');

  	User.getByEmail(email, function(err, user){	//find user

  		if(err){
  			res.render('user/login', {
  				title: "Remember Password",
				user: req.user,
			  	message: err 		//should probably tell them if email is not found
			});
  		}

  		var random_password = User.generateRandomPassword();	//create a new password
		user.password = random_password;

		user.save(function(err, usr){
			if(err){
				console.log(err);
				res.redirect('/404');
			}

			//send them the new email
			ForgottenEmail.sendMail(email, usr, random_password, function(){

					res.render('user/login', {
						title: "Login",
					user: req.user,
				  	message: 'Your new password has been sent.'
				});
			});
		});
	});
};

//change your password page
exports.password_form = function(req, res){
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

	User.findById(req.params.id, function(error, user) {

			res.render('user/password', {
				title: "Change Password",
				user: user//or should this be req.user???
			});
	});
};

//post for above
exports.password_change = function(req, res){
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

	User.findById(req.params.id, function(error, user) {

		var old = req.param('old');
		var password = req.param('password');

		user.comparePassword(old, function(err, isMatch){	//old password must match the one they gave
			if(err || isMatch == false){
				res.render('user/password', {
					title: "Change Password",
					user: req.user,
					message: "Old password was wrong"
				});
			}

			if(isMatch){	//old password matches
				user.password = password;	//update password
				user.save(function(err, usr){
					Family.getPlayersForUser(usr._id, function(players){
						res.redirect('/account');
						// res.render('user/account', {
						// 	user: req.user,
						// 	message: "New password set",
						// 	players: players
						// });
					});
				})
			}
		})

	});
};


//AJAX

exports.user_info = function(req, res){
	User.findById(req.params.id, function(error, user){
		var user_object = {
			first_name : user.first_name,
			last_name : user.last_name,
			_id : user._id,
			phone : user.phone,
			email : user.email
		};

		res.send(user_object);
	});
}



