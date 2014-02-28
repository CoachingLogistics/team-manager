var mongoose = require('mongoose'),
  Team = mongoose.model('Team');

exports.index = function(req, res){
  Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('team/index', {
      teams: teams
    });
  });
};

exports.show = function(req, res){
	//remember to put the id of the team in the request data
  	Team.findById(req.params.id, function(err, team){
  		//roster 
  		//RosterSpot.findAll({ team_id: team._id}, rspot);
		if(err) {
			throw new Error(err);
			//res.status(404).render('404');
		}else{
	    	res.render('team/show', {
	    	  team: team
	    	});			
		}

  	});
};

exports.edit = function(req, res){
	Team.findById(req.params.id, function(error, team){
		if(error) {
			throw new Error(error);
			//res.status(404).render('404');
		}else{
			res.render('team/edit', {
				team: team,
				user: req.user
			})
		}
	});
}

exports.new = function(req, res){
	res.render('team/new',{
		user: req.user
	});
}

exports.update = function(req, res){
	Team.findById(req.params.id, function(error, team){
		
		var oldTeam = JSON.parse(JSON.stringify( team ));

		team.name = req.body.name;
		team.sport = req.body.sport;

		team.save(function(err, team){
			if(err){
				res.render('team/edit', {
					team: oldTeam,
					message: err,
					user: req.user
				});
			}else{
				res.redirect('/teams/' + team._id);	
			}
		})
	})
};

exports.create = function(req, res){
	var newTeam = new Team({
		name: req.body.name,
		sport: req.body.sport
	});
	newTeam.save(function(err, team){
		if(err){
			res.render('team/new', {
				team: team,
				message: err,
				user: req.user
			});
		}else{
			res.redirect('/teams/' + team._id //, {
			//	team: team,
			//	message: "You have successfully created team " + team.name
			//}
			);
		}

	});
};

exports.delete = function (req, res){
	Team.findById(req.params.id, function(error, team){
		//if team doesn't have any players associated with it, can delete
	})
}