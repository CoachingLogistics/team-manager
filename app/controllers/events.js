var mongoose = require('mongoose');
var  Event = mongoose.model('Event');
var  Team = mongoose.model('Team');
var  Attendance = mongoose.model('Attendance');
var  RosterSpot = mongoose.model('RosterSpot');
var  Coach = mongoose.model('Coach');




exports.index = function(req, res){	//not used in production
  Event.find(function(err, events){
    if(err) throw new Error(err);
    res.render('event/index', {
      events: events,
      user:req.user
    });
  });
};

exports.new = function(req, res){	//not used in production
	Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('event/new', {
      teams: teams,
      user:req.user
    });
  });
};

exports.team_event = function(req, res){
	Team.findById(req.params.id, function(err, team){
		Coach.getUsersForTeam(team._id, function(err, coaches){

  			var access = false;
  			coaches.forEach(function(c){	//check to see if the user is a coach
  				if(req.user){
	  				if(req.user._id.equals(c._id)){
	  					access = true;
	  				}
	  			}
  			});
  			if(!access){
  				//not authorized
  				res.redirect('/');
  			}else{

			    if(err) throw new Error(err);
			    res.render('event/team_event', {
			      team: team,
			      user:req.user
			    });
			}
		});
    });
};


exports.create = function(req, res){

	var hour = req.param('hour');
	if(req.param('time')=="pm"){ hour= +hour + 12; }
	if(req.param('time')=="am" && req.param('hour')==12){ hour = 0; }
	var date = new Date(req.param('year'), req.param('month'), req.param('day'), hour, req.param('minute'));

	Team.findById(req.param('team_id'), function(err, team){
		if(err){
			//team does not exist
			res.redirect
		}

		//if team does exist, check user for authorization
		Coach.getUsersForTeam(team._id, function(err, coaches){

  			var access = false;
  			coaches.forEach(function(c){	//check to see if the user is a coach
  				if(req.user){
	  				if(req.user._id.equals(c._id)){
	  					access = true;
	  				}
	  			}
  			});
  			if(!access){
  				//not authorized
  				res.redirect('/');
  			}else{
				var newEvent = new Event({
					team_id: req.param('team_id'),
					date: date,
					location: req.body.location,
					description: req.body.description,
			  		type: req.param('type')
				});

				newEvent.save(function(err, event){
					if(err){
						console.log(err);
					}else{//no err

						Team.findById(event.team_id, function(err, team){

							RosterSpot.getByTeamId(team._id, function(err, spots){
								spots.forEach(function(spot){

									var att = new Attendance({
										roster_spot_id: spot._id,
										event_id:event._id,
										attendance: null
									});

									att.save(function(err, attendance){
										//nothing
									});
								})//foreach all attendances generated
							})




						})

						res.redirect('/events/' + event._id);
					}
				});
			}//auth else
		});
	});
};





exports.show = function(req, res){
  	Event.findById(req.params.id, function(err, event){
		if(err) {
			throw new Error(err);
		}else{
      // so default < = > comparisons aren't working, so
      var upcoming = false;
      var today = new Date();
      var date = event.date;
      if(today.getFullYear() < date.getFullYear()) {
        upcoming = true;
      }
      else if(today.getFullYear() == date.getFullYear() && today.getMonth() < date.getMonth()) {
        upcoming = true;
      }
      else if(today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() <= date.getDate()) {
        upcoming = true;
      }
      else {
        upcoming = false;
      }
			var time = "AM";
			var hour = event.date.getHours();
			if(event.date.getHours()>=12){
				hour = event.date.getHours()-12;
				time="PM";
			}
			var minutes = event.date.getMinutes();
			if(event.date.getMinutes() == 0){
				minutes = "00";
			}


			Team.findById(event.team_id, function(err, team){
    			if(err) throw new Error(err);

    			Coach.getUsersForTeam(team._id, function(err, coaches){	//get coachs
		  			var access = false;
		  			coaches.forEach(function(c){	//check to see if the user is a coach
		  				if(req.user){
			  				if(req.user._id.equals(c._id)){
			  					access = true;
			  				}
			  			}
		  			});
            var loggedIn = false;
            if(req.user) {
              loggedIn = true;
            }
	    			//find Attendances for this Event
	    			RosterSpot.getPlayersForTeam(team._id, function(players){
				    	res.render('event/show', {
				    	  event: event,
				    	  team: team,
				    	  user:req.user,
				    	  time: time,
				    	  hour: hour,
				    	  minutes: minutes,
				    	  players: players,
				    	  access: access,
                loggedIn: loggedIn,
                upcoming: upcoming
				    	});
	    			})
		    	})
		    })
		}
  	});
}

exports.edit = function(req, res) {
	Event.findById(req.params.id, function(err, event) {
		if(err) {
			return res.status(404).render('404', {user:req.user});
		}else {
			Team.findById(event.team_id, function(err, team){
				if(err) throw new Error(err);
				Coach.getUsersForTeam(team._id, function(err, coaches){

		  			var access = false;
		  			coaches.forEach(function(c){	//check to see if the user is a coach
		  				if(req.user){
			  				if(req.user._id.equals(c._id)){
			  					access = true;
			  				}
			  			}
		  			});
		  			if(!access){
		  				//not authorized
		  				res.redirect('/');
				  	}else{

						Team.find(function(err, teams){
		    				if(err) throw new Error(err);

							var month_name;
							if(event.date) {
								var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
								month_name = monthNames[event.date.getMonth()];
							}

							var time = "AM";
							var hour = event.date.getHours();
							if(event.date.getHours()>=12){
								hour = event.date.getHours()-12;
								time="PM";
							}

							return res.render('event/edit', {
								event: event,
								month: month_name,
								team: team,
								teams: teams,
								user:req.user,
								'error': null,
								time: time,
								hour: hour
							});
						})

					}//auth else
				});//coaches
			})//team
		}
	});
}

exports.update = function(req, res){
	var hour = req.param('hour');
	if(req.param('time')=="pm"){ hour= +hour + 12; }
	if(req.param('time')=="am" && req.param('hour')==12){ hour = 0; }
	var date = new Date(req.param('year'), req.param('month'), req.param('day'), hour, req.param('minute'));

		Event.findById(req.params.id, function(error, event){

			Team.findById(event.team_id, function(err, team){
				if(err) throw new Error(err);
				Coach.getUsersForTeam(team._id, function(err, coaches){

		  			var access = false;
		  			coaches.forEach(function(c){	//check to see if the user is a coach
		  				if(req.user){
			  				if(req.user._id.equals(c._id)){
			  					access = true;
			  				}
			  			}
		  			});
		  			if(!access){
		  				//not authorized
		  				res.redirect('/');
				  	}else{

				  		event.date = date;
						event.location = req.param('location');
						event.type = req.param('type');
						event.description = req.param('description');

						event.save(function(err, event){
							if(err){
								console.log(err);
								res.redirect('/');
							}else{
								res.redirect('/events/' + event._id);
							}
						})
					}
				})

			});
		});
};


exports.delete = function(req, res) {
	Event.findById(req.params.id, function(error, event){
		Team.findById(event.team_id, function(err, team){
			if(err) throw new Error(err);
			Coach.getUsersForTeam(team._id, function(err, coaches){
	  			var access = false;
	  			coaches.forEach(function(c){	//check to see if the user is a coach
	  				if(req.user){
		  				if(req.user._id.equals(c._id)){
		  					access = true;
		  				}
		  			}
	  			});
	  			if(!access){
	  				//not authorized
	  				res.redirect('/');
			  	}else{

					Event.remove({_id: req.params.id}, function(err, docs) {
						if(err) {
							return res.redirect('/events/' + req.params.id);
						}
						else {
							return res.redirect('/events');
						}
					});
				}
			});
		});
	});
}



//AJAX
exports.attendance = function(req, res){
	//i need the roster_spot_id
	Event.findById(req.params.event_id, function(err, event){
		Team.findById(event.team_id, function(err, team){
			RosterSpot.getByIds(team._id, req.params.player_id, function(err, spot){

				Attendance.getByIds(event._id, spot._id, function(err, attendance){
					res.send(attendance);
				})
			})

		})
	})
	// Attendance.findById(req.params.event_id, function(err, event){
	// 	Pl
	// })


}
