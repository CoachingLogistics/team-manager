var mongoose = require('mongoose'),
  User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;
var Family = mongoose.model('Family');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var ForgottenEmail = require('../mailers/forgotten_email');


exports.account = function(req, res){	//test non-access?

	Family.getPlayersForUser(req.user._id, function(players){

		res.render('user/account', {
			user: req.user,
		  	title: 'My Account',
		  	players: players
		});

	});
};

exports.index = function(req, res){			//delete this later
	User.find({}, function(error, users) {

		res.render('user/index', {
			user: req.user,
			users: users
		});
	});
};

exports.show = function(req, res){
	User.findById(req.params.id, function(error, user) {
		Family.getPlayersForUser(user._id, function(players){

			res.render('user/show', {
				user: req.user,
				user_show: user,
			  	players: players
			});

		});
	});
};

exports.registration = function(req, res){
	res.render('user/register', {
		user: req.user,
	  	title: 'Register',
	  	message: req.session.messages
	});
};

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
				title: 'Registration',
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


exports.logout = function(req, res){
  req.logout();
  res.redirect('back');
};


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


exports.delete = function(req, res){
  	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

    User.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		res.redirect('/users/'+req.params.id);
    	}
      // req.flash('info', 'User successfully deleted');

      //delete dependent families/coaches?



      res.redirect('/');
    });

};



exports.forget = function(req, res){
  	res.render('user/forget', {
		user: req.user,
		message: req.session.messages
	});
};

exports.remember = function(req, res){
  	var email = req.param('email');

  	User.getByEmail(email, function(err, user){

  		if(err){
  			res.render('user/login', {
				user: req.user,
			  	message: err
			});
  		}

  		var random_password = User.generateRandomPassword();
		user.password = random_password;

		user.save(function(err, usr){
			if(err){
				console.log(err);
				res.redirect('/404');
			}

			//can do email, or usr.email

			ForgottenEmail.sendMail(email, usr, random_password, function(){
					res.render('user/login', {
					user: req.user,
				  	message: 'Your new password has been sent.'
				});
			});
		});
	});
};


exports.password_form = function(req, res){
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

	User.findById(req.params.id, function(error, user) {

			res.render('user/password', {
				user: user//or should this be req.user???
			});
	});
};


exports.password_change = function(req, res){
	if(req.user._id != req.params.id){
		//not authorized
		res.redirect('/404');
	}

	User.findById(req.params.id, function(error, user) {

		var old = req.param('old');
		var password = req.param('password');

		user.comparePassword(old, function(err, isMatch){
			if(err || isMatch == false){
				res.render('user/password', {
					user: req.user,
					message: "Old password was wrong"
				});
			}

			if(isMatch){
				user.password = password;
				user.save(function(err, usr){
					Family.getPlayersForUser(usr._id, function(players){
						res.render('user/account', {
							user: req.user,
							message: "New password set",
							players: players
						});
					});
				})
			}
		})

	});
};
