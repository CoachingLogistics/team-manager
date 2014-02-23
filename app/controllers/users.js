var mongoose = require('mongoose'),
  User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;

exports.account = function(req, res){
	res.render('user/account', {
		user: req.user,
	  	title: 'My Account'
	});
};

exports.show = function(req, res){
	User.findById(req.params.id, function(error, user) {

		var authorization = false;
		if(user._id == req.user._id){
			authorization = true;
		}

		res.render('user/show', {
			user: req.user,
			user_show: user,
			authorized: authorization
			//ADD IN OTHER STUFF?
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


exports.edit = function(req, res){
	res.render('user/edit', {
		user: req.user,
		title: 'Edit User',
	  	message: req.session.messages
	  	//MORE STUFF
	});
};

exports.update = function(req, res){

	User.update(req.params.id, {$set:{
		email: req.param('email'),
		first_name: req.param('first_name'),
		last_name: req.param('last_name'),
		phone: req.param('phone'),
		password: req.param('password')

	}}, function(error, user){
		//req.flash('info', 'User successfully edited');
      	res.redirect('/account');
	});
};


exports.delete = function(req, res){
  if(req.user._id == req.params.id){
    User.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		res.redirect('/user/'+req.params.id);
    	}
      // req.flash('info', 'User successfully deleted');
      res.redirect('/');
    });
  }else{
    // req.flash('info', 'You are not authorized to delete this user');
    res.redirect('/')
  }
};








