var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
var	ObjectId = Schema.ObjectId;
var	Player = mongoose.model('Player');
var	Team = mongoose.model('Team');
var	Event = mongoose.model('Event');
var	RosterSpot = mongoose.model('RosterSpot');
var	Carpool = mongoose.model('Carpool');
var Rider = mongoose.model('Rider');
var Family = mongoose.model('Family');
var async = require('async');


//get
//needs event_id in param
exports.show = function(req, res){
	Carpool.findById(req.params.id, function(err, carpool){
		User.findById(carpool.user_id, function(err, driver){
			Event.findById(carpool.event_id, function(err, event){
				Team.findById(event.team_id, function(err, team){

					var access=false;
					if(req.user){
						console.log(req.user._id)
						console.log(driver._id)
						if(req.user._id.equals(driver._id)){
							access=true;
						}
					}
					Rider.getByCarpoolId(carpool._id, function(err, riders) {
						var riderArr = new Array();
						var spotsLeft = carpool.size - riders.length;
						async.each(riders, function(rider, innerCallback) {
							RosterSpot.findById(rider.roster_spot_id, function(err, rs) {
								Player.findById(rs.player_id, function(err, pl) {
									riderArr.push({'player': pl, 'confirmed': rider.confirmed});
									innerCallback();
								});
							});
						}, function(err) {
							res.render('carpool/show', {
								carpool: carpool,
									title: 'Carpool Details',
									event: event,
									date: dateFormat(carpool.time),
									dateStr: dateRFCFormat(carpool.time),
									timeStr: timeRFCFormat(carpool.time),
									time: timeFormat(carpool.time),
									team: team,
									driver: driver,
									user:req.user,
									riders: riderArr,
									spotsLeft: spotsLeft,
									access: access
								});
						});
					});
				});
			})
		})

	})
};

//get
//needs event_id in param
exports.new = function(req, res){
	Event.findById(req.params.event_id, function(err, event){
		Team.findById(event.team_id, function(err, team){

			var authorized_users = [];

			// need to check if user has a player or is a coach on team
			Coach.getUsersForTeam(team._id, function(err, coaches){
				coaches.forEach(function(coach){
					authorized_users.push()
				});

				RosterSpot.getPlayersForTeam(team._id, function(players){

					async.each(players, function(player, innerCallback) {
						player.getUsers(function(users){
							users.forEach(function(user){
								authorized_users.push(user);
							});
							innerCallback();
						})
					}, function(err) {

						var access = false;
			  			authorized_users.forEach(function(c){	//check to see if the user is a coach
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
							res.render('carpool/new', {
								title: 'New Carpool',
						      event: event,
						      date: dateFormat(event.date),
						      team: team,
						      user:req.user
						    });
			  			}
					});
				})
			})
		});
	})
};

//post
exports.create = function(req, res){

	Event.findById(req.param('event_id'), function(err, event){

			var time = req.param('time');
			var date = new Date(event.date);
			date.setHours(parseInt(time[0]+time[1]), parseInt(time[3]+time[4]));
			Team.findById(event.team_id, function(err, team){

			var authorized_users = [];

			// need to check if user has a player or is a coach on team
			Coach.getUsersForTeam(team._id, function(err, coaches){
				coaches.forEach(function(coach){
					authorized_users.push()
				});

				RosterSpot.getPlayersForTeam(team._id, function(players){

					async.each(players, function(player, innerCallback) {
						player.getUsers(function(users){
							users.forEach(function(user){
								authorized_users.push(user);
							})
							innerCallback();
						})
					}, function(err) {

						var access = false;
			  			authorized_users.forEach(function(c){	//check to see if the user is a coach
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

							var newCarpool = new Carpool({
								user_id: req.param('user_id'),
								event_id: req.param('event_id'),
								location: req.param('location'),
								notes: req.param('notes'),
								time: date,
								size: req.param('size')
							});

							newCarpool.save(function(err, cp){
								Team.findById(event.team_id, function(err, team) {
									Family.getPlayersForUser(cp.user_id, function(players) {
										players.forEach(function(player) {
											RosterSpot.getByIds(team._id, player._id, function(err, rs){

												if(rs){
													var newRider = new Rider({
														roster_spot_id: rs._id,
														carpool_id: cp._id,
														event_id: cp.event_id,
														location: cp.location,
														time: cp.time,
														confirmed: true
													});
													newRider.save(function(err, saved) {
														console.log('saved');
													});
												}
											});
										});
										return res.redirect('/events/'+event._id);
									});
								});
							})
			  			}//end of auth

					});//async function
				})//roster
			})//coaches
		});//team

	})//event

};

//get
exports.edit = function(req, res){

	Carpool.findById(req.params.id, function(err, carpool){

		if(!req.user._id.equals(carpool.user_id)){
			//not authorized
			res.redirect('/404');
		}else{
			User.findById(carpool.user_id, function(err, driver){
				Event.findById(carpool.event_id, function(err, event){
					Team.findById(event.team_id, function(err, team){


						if(!req.user._id.equals(driver._id)){
							res.redirect('back');
						}

						res.render('carpool/edit', {
						  carpool: carpool,
					      timeStr: timeRFCFormat(carpool.time),
					      user:req.user,
					      event: event,
					      date: dateFormat(carpool.time),
					      team: team,
					      title: "Edit Carpool"
					    });
					})
				})
			})
		}

	})
};

//post
exports.update = function(req, res){
		

		Carpool.findById(req.params.id, function(error, carpool){

			if(!req.user._id.equals(carpool.user_id)){
				//not authorized
				res.redirect('/404');
			}else{
				//breaking down the time input to  DATETIME format
				var time = req.param('time');
				var date = new Date(carpool.time);
				date.setHours(parseInt(time[0]+time[1]), parseInt(time[3]+time[4]));

	  			if(!req.user._id.equals(carpool.user_id)){
	  				//not authorized
	  				res.redirect('/');
			  	}else{

					  		carpool.time = date;
							carpool.location = req.param('location');
							carpool.size = req.param('size');
							carpool.notes = req.param('notes');

							carpool.save(function(err, cp){
								if(err){
									console.log(err);
									res.redirect('/');
								}else{
									res.redirect('/carpools/' + cp._id);
								}
							})
				}
			}
		});
};





//pass in user_id and event_id?
exports.deleteByIds = function (req, res){

}

exports.delete = function(req, res){	//post       //test

  	Carpool.findById(req.params.id, function(err, cp){

		if(!req.user._id.equals(cp.user_id)){
			//not authorized
			res.redirect('/404');
		}else{
	  		var event_id = cp.event_id;
		    Carpool.remove({_id: req.params.id}, function(error, carpool){
		    	if(error){
		    		console.log(error);
		    	}
		    	//redirect?
		      	res.redirect('/events/'+event_id);
		    });
		}
      })

};

/*
 * fixed add rider still testing this out
 */
exports.addRider = function(req, res) {
	var carpool_id = req.param('id');
	Carpool.findById(carpool_id, function(err, theCarpool) {
		if(err) { return res.redirect('/'); }
		if(!req.user._id.equals(theCarpool.user_id)) {
			// not authorized
			return res.redirect('/404');
		} else {
			var event_id = theCarpool.event_id;
			Event.findById(event_id, function(err, theEvent) {
				if(err) { return res.redirect('/'); }
				var team_id = theEvent.team_id;
				RosterSpot.getByTeamId(team_id, function(err, rosterSpots) {
					if(err) { return res.redirect('/'); }
					var playerArr = [];
					async.each(rosterSpots, function(rosterSpot, innerCallback) {
						Rider.getByEventAndRosterSpotId(event_id, rosterSpot._id, function(err, theRider) {
							if(!err && !theRider) {
								Player.findById(rosterSpot.player_id, function(err, thePlayer) {
									playerArr.push(thePlayer);
									innerCallback();
								});
							}
							else {
								innerCallback();
							}
						});
					}, function(error) {
						if(error) { return res.redirect('/'); }
						return res.render('carpool/addRider', {
							title: "Add a Rider",
							'user': req.user,
							'event': theEvent,
							'rosterSpots': rosterSpots,
							'players': playerArr,
							'carpool': theCarpool,
							'warning': undefined});
					});
				});
			});
		}
	});
}


//AJAX only

//returns coordinates for an event's location, to be used in google maps
exports.routing = function(req,res){
	Carpool.findById(req.params.id, function(err, carpool){
		carpool.getEvent(function(error, event){
			Rider.getByCarpoolId(req.params.id, function(er, riders){

				var doc={
					event: event,
					carpool: carpool,
					riders: riders
				}

				res.send(doc);
			})
		})
	});
}

//returns the rider objects for a carpool
exports.riders = function(req,res){
	Carpool.findById(req.params.id, function(err, carpool){
			Rider.getByCarpoolId(req.params.id, function(er, riders){

				var players = []

				async.each(riders, function(rider, innerCallback) {
							rider.getRider(function(err, player){
								players.push(player);
								innerCallback();
							});
						}, function(err) {
							res.send(players);
						})
			})
	});
}



//helpers
var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

var timeFormat = function(date) {
    var time = "AM";
	var hour = date.getHours();
	if( date.getHours()>=12){
		if(date.getHours()>12){
			hour =  date.getHours()-12;
		}else{
			hour = 12;
		}

		time="PM";
	}

	var minutes = date.getMinutes();
	if(date.getMinutes() == 0){
		minutes = "00";
	}

	return hour+":"+minutes+" "+time;
};

var dateRFCFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    if (day < 10){
    	day = "0" + day;
    }
    if (month < 10){
    	month = "0" + month;
    }
    return year+"-"+month+"-"+day;
};

var timeRFCFormat = function(date){
	var hour = date.getHours();
	var minutes = date.getMinutes();

	if (hour < 10){
		hour = "0" + hour;
	}
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	return hour + ":" + minutes + ":00";
};
