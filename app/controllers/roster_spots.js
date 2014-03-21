var mongoose = require('mongoose'),
  RosterSpot = mongoose.model('RosterSpot');

// exports.index = function(req, res){
//   Team.find(function(err, teams){
//     if(err) throw new Error(err);
//     res.render('team/index', {
//       teams: teams
//     });
//   });
// };

// exports.show = function(req, res){
// 	//remember to put the id of the team in the request data
//   	Team.findById(req.params.id, function(err, team){
//   		//roster 
//   		//RosterSpot.findAll({ team_id: team._id}, rspot);
// 		if(err) {
// 			throw new Error(err);
// 			//res.status(404).render('404');
// 		}else{
// 	    	res.render('team/show', {
// 	    	  team: team
// 	    	});			
// 		}

//   	});
// };

// exports.edit = function(req, res){
// 	Team.findById(req.params.id, function(error, team){
// 		if(error) {
// 			throw new Error(error);
// 			//res.status(404).render('404');
// 		}else{
// 			res.render('team/edit', {
// 				team: team
// 			})
// 		}
// 	});
// }

 // exports.new = function(req, res){

 // 	res.render('roster_spot/new', );
 // }

// exports.update = function(req, res){
// 	RosterSpot.findById(req.params.id, function(error, roster_spot){
		
// 		var oldTeam = JSON.parse(JSON.stringify( roster_spot ));

// 		roster_spot.team = req.body.team;
// 		roster_spot.player_id = req.body.player_id;

// 		team.save(function(err, team){
// 			if(err){
// 				res.render('team/edit', {
// 					team: oldTeam,
// 					message: err
// 				});
// 			}else{
// 				res.redirect('/teams/' + team._id);	
// 			}
// 		})
// 	})
// };

exports.create = function(req, res){
	var newRosterSpot = new RosterSpot({
		team_id: req.body.team_id,
		player_id: req.body.player_id
	});
	newRosterSpot.save(function(err, roster_spot){
		RosterSpot.getAllPlayers(err, function(err, players){
			RosterSpot.getAllTeams(err, function(err, teams){
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

exports.delete = function (req, res){
	RosterSpot.remove({_id: req.params.id}, function(error, rosterSpot){
		if err throw new Error(error);
		else{
			res.redirect('/teams/');
		}
	})
}



exports.deleteByIds = function (req, res){
	RosterSpot.getByIds(req.params.team_id, req.params.player_id, function(err, spot){
		if(err) console.log(err);

		RosterSpot.remove({_id:spot._id}, function(err, ret){
			res.redirect('back');
		});

	});
}



