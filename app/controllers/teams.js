var mongoose = require('mongoose'),
  Team = mongoose.model('Team');

exports.index = function(req, res){
  Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('team/index', {
      title: 'Teams',
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
      title: 'Teams',
      teams: teams
    });
  });
};

exports.edit = function(req, res){
	Team.findById(req.params.id, function(error, team){
		if(error) throw new Error(err);

		res.render('team/edit', {
			name: team.name,
			sport: team.sport
		})
	});
}

exports.new = function(req, res){
	res.render('team/new');
}

exports.update = function(req, res){
	Team.findById(req.params.id, function(error, team){
		team.name = req.data.name;
		team.sport = req.data.sport;
	})
	team.save(function(err, team){
		if(err){
			res.render('team/new', {
				user: req.data.name,
				title: req.data.sport,
				message: err
			});
		}
		res.redirect('/');
	});
};

exports.create = function(req, res){
	var newTeam = new Team({
		name: req.data.name,
		sport: req.data.sport
	});
	newTeam.save(function(err, team){
		if(err){
			res.render('team/new', {
				user: req.data.name,
				title: req.data.sport,
				message: err
			});
		}
		res.redirect('/');
	});
};