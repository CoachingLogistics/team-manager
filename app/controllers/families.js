var mongoose = require('mongoose');
var User = mongoose.model('User');
var Player = mongoose.model('Player');
var Family = mongoose.model('Family');


exports.new = function(req, res){	//post       //test
	var newFamily = new Family({
		user_id: req.param('user_id'),
		player_id: req.param('player_id')
	});

	newFamily.save(function(err, family){
		if(err){
			console.log(err);
			//redirect to 404?
		}
		res.send(family);
	});
};


exports.delete = function(req, res){	//post       //test
  //if(req.user._id == req.params.id){	//authorize
    Family.remove({_id: req.params.id}, function(error, docs) {
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


exports.index = function(req, res){
  Family.find({}, function(error, families) {

    res.render('./families_index', {
      user: req.user,
      families: families
    });
  });
};
//any more controllers?  To deliver sets of users/players?


