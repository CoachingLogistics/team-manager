var mongoose = require('mongoose'),
	Coach = mongoose.model('Coach');

var USER = 'user';
var COACH = 'coach';
var role;

exports.index = function(req, res){
	Coach.getByUserId(req.user._id, function(err, coaches){
		if(coaches.length == 0){
			role = USER;
		}else{
			role = COACH;
		}
	});
  	res.render('home/index', {
    	title: 'Team Manager',
    	user: req.user,
    	role: role
  });
};

exports.err = function(req, res){
  res.render('404', {
    title: 'Team Manager',
    user: req.user,
    role: role
  });
};