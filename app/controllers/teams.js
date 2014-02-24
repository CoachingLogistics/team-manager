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
	    if(err) throw new Error(err);

	    res.render('team/show', {
	      team: team
	    });
  	});
};

exports.edit = function(req, res){
	Team.findById(req.params.id, function(error, team){
		if(error) throw new Error(err);

		res.render('team/edit', {
			team: team
		})
	});
}

exports.new = function(req, res){
	res.render('team/new');
}

exports.update = function(req, res){
	Team.findById(req.params.id, function(error, team){
		team.name = req.body.name;
		team.sport = req.body.sport;

		team.save(function(err, team){
			if(err){
				res.render('team/new', {
					team: team,
					message: err
				});
			}
			res.redirect('/teams/' + team._id
				//{
				//team: team,
				//message: "You have successfully updated team " + team.name
				//}
			);
		});
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
				message: err
			});
		}
		res.redirect('/teams/' + team._id //, {
		//	team: team,
		//	message: "You have successfully created team " + team.name
		//}
		);
	});
};

exports.delete = function (req, res){
	Team.findById(req.params.id, function(error, team){
		//if team doesn't have any players associated with it, can delete
	})
}