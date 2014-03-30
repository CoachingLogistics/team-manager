var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var Coach = mongoose.model('Coach');
var Team = mongoose.model('Team');
var Family = mongoose.model('Family');
var RosterSpot = mongoose.model('RosterSpot');


//not used in production
exports.create = function(req, res){
	var newRosterSpot = new RosterSpot({
		team_id: req.body.team_id,
		player_id: req.body.player_id
	});
	newRosterSpot.save(function(err, roster_spot){
		Player.find(function(err, players){

			Team.find(function(err, teams){
				if(err){
					console.log(err);
					//render 404, this method should only be created when the user registers a player,
					//either automatically upon registration of the user or when the user registers another player
					//});
				}else{
					res.redirect('/teams/new/' //, {
					//	team: team,
					//	message: "You have successfully created team " + team.name
					//}
					);
				}
			})
		})
	});
};

//not functioning yet.  do we even want to delete roster spots?
exports.delete = function (req, res){
	RosterSpot.remove({_id: req.params.id}, function(error, rosterSpot){
		if (error){
			console.log(error);
		}
		else{
			res.redirect('/teams/');
		}
	})
}


//deletes a roster spot for a given team and player
exports.deleteByIds = function (req, res){
	var access_ids =[];
	Team.findById(req.params.team_id, function(err, team){
		Coach.getUsersForTeam(team._id, function(err, coaches){
			Family.getUserIdsForPlayer(req.params.player_id, function(parent_ids){

				coaches.forEach(function(c){access_ids.push(c._id)});	//if user is a coach or parent
				parent_ids.forEach(function(p){access_ids.push(p)});	//they get access

	  			var access = false;
	  			access_ids.forEach(function(id){	//check to see if the user is a coach
	  				if(req.user){
		  				if(req.user._id.equals(id)){
		  					access = true;
		  				}
		  			}
	  			});

	  			 if(!access){
	  				//not authorized
	  				res.redirect('/');
	  			}else{
					RosterSpot.getByIds(req.params.team_id, req.params.player_id, function(err, spot){
						if(err) console.log(err);

						RosterSpot.remove({_id:spot._id}, function(err, ret){
							res.redirect('back');
						});

					});
	  			}
  			});
  		});
	})
}



