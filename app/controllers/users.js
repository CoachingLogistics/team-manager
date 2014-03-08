var mongoose = require('mongoose'),
  User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;
var Family = mongoose.model('Family');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');


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
			res.render('user/register', {
				user: req.user,
				title: 'Registration',
				message: err
			});
		}
		res.redirect('/');
	});
};


exports.signin = function(req, res){
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
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};


exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};


exports.edit = function(req, res){		//ONLY A PERSON CAN EDIT THEIR OWN ACCOUNT
	if(req.user._id == req.params.id){
		res.render('user/edit', {
			user: req.user,
			title: 'Edit User',
		  	message: req.session.messages
		  	//MORE STUFF
		});
	}else{
		res.redirect("/404");
	}
};

exports.update = function(req, res){

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
  if(req.user._id == req.params.id){
    User.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		res.redirect('/users/'+req.params.id);
    	}
      // req.flash('info', 'User successfully deleted');

      //delete dependent families/coaches?



      res.redirect('/');
    });
  }else{
    // req.flash('info', 'You are not authorized to delete this user');
    res.redirect('/')
  }
};








