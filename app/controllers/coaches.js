var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Coach = mongoose.model('Coach');


exports.new = function(req, res){	//post
	var newCoach = new Coach({
		user_id: req.param('user_id'),
		team_id: req.param('team_id')
	});

	newCoach.save(function(err, coach){
		if(err){
			console.log(err);
			//redirect to 404?
		}
		//redirect to Player page?
	});
};


exports.delete = function(req, res){	//post
  //if(req.user._id == req.params.id){	//authorize
    Coach.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		console.log(error);
    		//redirect?
    	}
    	//redirect?
      	res.redirect('/');
    });
  //}else{
    //not authorized
    //res.redirect('/')
  //}
};


