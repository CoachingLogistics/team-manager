var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Coach = mongoose.model('Coach');


//not used in production
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





//not used in production
exports.delete = function(req, res){	//post   //authorize?
    Coach.remove({_id: req.params.id}, function(error, docs) {
    	if(error){
    		console.log(error);
    	}
      	res.redirect('/');
    });

};




exports.deleteByIds = function (req, res){
  Team.findById(req.params.team_id, function(err, team){
    Coach.getUsersForTeam(team._id, function(err, coaches){

      var access = false;   //variable to check authorization
      coaches.forEach(function(c){  //check to see if the user is a coach
        if(req.user){
          if(req.user._id.equals(c._id)){
            access = true;
          }
        }
      });
      if(req.user._id == req.params.user_id){access=true;}  //either another coach or a user can delete
      
      if(!access){
        //not authorized
        res.redirect('/');
      }else{

        Coach.getByIds(req.params.team_id, req.params.user_id, function(err, coach){
          if(err) console.log(err);

          Coach.remove({_id:coach._id}, function(err, ret){
            res.redirect('back');
          });

        });
      }
    });
  });
}
