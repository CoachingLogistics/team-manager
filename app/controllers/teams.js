var mongoose = require('mongoose'),
Team = mongoose.model('Team');
Player = mongoose.model('Player');
User = mongoose.model('User');
Family = mongoose.model('Family');
RosterSpot = mongoose.model('RosterSpot');
Event = mongoose.model('Event');
Coach = mongoose.model('Coach');
Attendance = mongoose.model('Attendance');
Carpool = mongoose.model('Carpool');
Rider = mongoose.model('Rider');

var mailer = require('../mailers/team_mailer.js');
var NewUserAdded = require('../mailers/new_added_user');
var ExistingPlayer = require('../mailers/existing_player');
var NewPlayer = require('../mailers/new_player');
var NewCoach = require('../mailers/new_coach');
var ExistingCoach = require('../mailers/existing_coach');
var async = require('async');

/*
 * This renders the team's index page
 * The teams are populated by the teams the user coaches and the
 * teams the user's players are on
 */
exports.index = function(req, res) {
  if(!req.user) {
    return res.redirect('/');
  }
  var playerTeams = [];
  Coach.getTeamsForUser(req.user.id, function(err, coachedTeams) {
    Family.getPlayerIdsForUser(req.user.id, function(playerIds) {
      async.each(playerIds, function(playerId, innerCallback) {
        RosterSpot.getTeamsForPlayer(playerId, function(rosterSpotTeams) {
          async.each(rosterSpotTeams, function(oneTeam, innerCallbackSecond) {
            playerTeams.push(oneTeam);
            innerCallbackSecond();
          }, function(asyncError2) {
            innerCallback();
          });
        });
      }, function(asyncError){
        return res.render('team/index', {
        	title: "Teams",
          'user': req.user,
          'coachedTeams': coachedTeams,
          'playerTeams': playerTeams
        });
      });
    });
  });
}


//get
exports.show = function(req, res){
	//remember to put the id of the team in the request data
  	Team.findById(req.params.id, function(err, team){	//get team
  		Coach.getUsersForTeam(team._id, function(err, coaches){	//get coachs
  			var members = [];
  			var drivers = [];
  			var access = false;
  			var coach_emails = [];
  			coaches.forEach(function(c){	//check to see if the user is a coach
  				coach_emails.push(c.email);
  				drivers.push(c);
  				if(req.user){
	  				if(req.user._id.equals(c._id)){
	  					access = true;
	  				}
	  			}
  			});

  			Event.getByTeamId(team._id, function(err, evs){	//get events
  				var events = [];
  				//formatting the event objects to be displayed in the calendar (fullcalendar.js -- google it)
				evs.forEach(function(obj){
					var noob = {};
				    noob.title = obj.type+'\n'+timeFormat(obj.date)+'\n'+obj.location;
				    noob.start = obj.date;
				    noob.url = '/events/'+obj._id;
				    noob.color = "#FFFFCC";

				    if(obj.type == 'Practice'){
				    	noob.color = "#C3EBFF";
				    }else if(obj.type == 'Game'){
				    	noob.color = "#ADEBAD";
				    }else if(obj.type == 'Meeting'){
				    	noob.color = "#CCCCFF";
				    }else{
				    	noob.color = "#FFFFCC";
				    }
				    events.push(noob);
				});

  				RosterSpot.getPlayersForTeam(team._id, function(players){	//get players to show roster

  					async.each(players, function(player, innerCallback) {
						player.getUsers(function(users){
							users.forEach(function(user){

								var listed = false;
								coach_emails.forEach(function(c){
									if(user.email==c){
										listed = true;
									}
								})
								if(listed==false){ drivers.push(user)};
								innerCallback();
							})
						})
					}, function(err){

						async.each(drivers, function(driver, innerCallback1) {
							var carpool_num = 0;
							var rider_num = 0;

							Carpool.getByTeamAndUserId(team._id, driver._id, function(err, carpools){
								carpool_num = carpools.length;

								async.each(carpools, function(carpool, innerCallback2) {
									Rider.getByCarpoolId(carpool._id, function(err, riders){
										rider_num += riders.length;
										innerCallback2();
									})

								}, function(err){

									var dr = {
										_id: driver._id,
										carpools: carpool_num,
										riders: rider_num,
										first_name: driver.first_name,
										last_name: driver.last_name,
										email: driver.email,
										phone: driver.phone
									}

									members.push(dr);

									innerCallback1();
								});
							});//carpool

						}, function(err){

							members.sort(function (a, b){
							    if (a.carpools < b.carpools){
							      return 1;
							  	}
							    else if (a.carpools > b.carpools){
							      return -1;
							  	} else {
							    	if(a.riders>b.riders) return 1;
							    	if(a.riders<b.riders) return -1;
							    	return 0;
							    }
							});


							if(err) {
								throw new Error(err);
								//res.status(404).render('404');
							}else{

						    	res.render('team/show', {
						    		title: team.name,
						    	  team: team,
						    	  user:req.user,
						    	  events: events,
						    	  players: players,
						    	  coaches: coaches,
						    	  access: access,
						    	  drivers: members
						    	});
							}
						});
					});//async
				});
			});
  		});

  	});
};


//this is an AJAX call, which returns the fullcalendar.js formatted events
//not used in production
exports.calendar = function(req, res) {
	Event.getByTeamId(req.params.id, function(err, evs){	//get events

		var events = [];
		evs.forEach(function(obj){
			var noob = {};
		    noob.title = obj.type+'\n'+timeFormat(obj.date)+'\n'+obj.location;
		    noob.start = obj.date;
		    noob.url = '/events/'+obj._id;
		    noob.color = "#FFFFCC";

		    if(obj.type == 'Practice'){
		    	noob.color = "#C3EBFF";
		    }else if(obj.type == 'Game'){
		    	noob.color = "#ADEBAD";
		    }else if(obj.type == 'Meeting'){
		    	noob.color = "#CCCCFF";
		    }else{
		    	noob.color = "#FFFFCC";
		    }
		    events.push(noob);
		});

		res.send(events);
	});
};




//get
exports.edit = function(req, res){
	Team.findById(req.params.id, function(error, team){
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


				if(error) {
					throw new Error(error);
					//res.status(404).render('404');
				}else{
					res.render('team/edit', {
						title: "Edit " + team.name,
						team: team,
						user: req.user,
						coaches: coaches
					})
				}
			}
		});
	});
}

//get
exports.new = function(req, res){
	res.render('team/new',{
		title: "New Team",
		user: req.user
	});
}

//post
exports.update = function(req, res){
	Team.findById(req.params.id, function(error, team){
		Coach.getUsersForTeam(team._id, function(err, coachez){

  			var access = false;
  			coachez.forEach(function(c){	//check to see if the user is a coach
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

				var oldTeam = JSON.parse(JSON.stringify( team ));

				team.name = req.body.name;
				team.sport = req.body.sport;

				var coaches = [];

				if(req.param('coaches')){	//string of comma separated emails, to be given coach status
					var co = req.param('coaches').split(",");

					co.forEach(function(c){
						c = c.replace(' ', '');
						coaches.push(c);
					})
					//split the string to get individual emails
				}



				team.save(function(err, team){

					if(err){
						res.render('team/edit', {
							title: "Edit " + oldTeam.name,
							team: oldTeam,
							message: err,
							user: req.user
						});
					}else{

							if(coaches.length>0){			//more coaches
								coaches.forEach(function(cmail){

									User.getByEmail(cmail, function(err, user){	//see if the email is linke to a user
										if(err) console.log(err);

										if(user){	//user exists

											var manager = new Coach({	//create new coach
												user_id: user._id,
												team_id: team._id
											});

											manager.save(function(err, manager){
												//email
												ExistingCoach.sendMail(req.user, team, user, function(){
														//nothing
												});
											});

										}else{	//user must be created

											var random_password = User.generateRandomPassword();

											var new_user = new User({		//user's password needs to be sent to them
												email: cmail,
												active: false,
												password: random_password
											});

											new_user.save(function(error, usr){	//new user created


												var manager = new Coach({
													user_id: usr._id,
													team_id: team._id
												});
												manager.save(function(err, manager){//new coach saved
													//email
													NewCoach.sendMail(req.user, team, usr, random_password, function(){
															//nothing
													});

												});
											})

										}//else
									})
								})
							}//coaches.length

						res.redirect('/teams/' + team._id);
					}
				})
			}//else
		});//coaches
	});//team
};

//post
exports.create = function(req, res){
	var newTeam = new Team({
		name: req.body.name,
		sport: req.body.sport
	});
	newTeam.save(function(err, team){
		if(err){
			res.render('team/new', {
				title: "New Team",
				team: team,
				message: err,
				user: req.user
			});
		}else{

			var coach = new Coach({
				user_id: req.user._id,
				team_id: team._id
			});

			var coaches = [];

			if(req.param('coaches')){	//string of comma separated emails, to be given coach status
				var co = req.param('coaches').split(",");

				co.forEach(function(c){
					c = c.replace(' ', '');
					coaches.push(c);
				})
				//split the string to get individual emails
			}



			coach.save(function(err, coach){	//save the original coach
				if(coaches.length>0){			//more coaches
					coaches.forEach(function(cmail){

						User.getByEmail(cmail, function(err, user){	//see if the email is linke to a user
							if(err) console.log(err);

							if(user){	//user exists

								var manager = new Coach({	//create new coach
									user_id: user._id,
									team_id: team._id
								});

								manager.save(function(err, manager){
									//email
									ExistingCoach.sendMail(req.user, team, user, function(){
											//nothing
									});
								});

							}else{	//user must be created

								var random_password = User.generateRandomPassword();

								var new_user = new User({		//user's password needs to be sent to them
									email: cmail,
									active: false,
									password: random_password
								});

								new_user.save(function(error, usr){	//new user created


									var manager = new Coach({
										user_id: usr._id,
										team_id: team._id
									});
									manager.save(function(err, manager){//new coach saved
										//email
										NewCoach.sendMail(req.user, team, usr, random_password, function(){
												//nothing
										});

									});
								})

							}//else
						})
					})
				}
				//better to redirect to the roster fill page than the team page, better flow
				res.redirect('/teams/'+ team._id+'/roster-fill');
			});//coach save

		}

	});
};


//do we want to delete a team?
//not currently used
exports.delete = function (req, res){
	Team.findById(req.params.id, function(error, team){
		//if team doesn't have any players associated with it, can delete



		//delete dependent roster spots/events/attendances?
	});
};





//******TEAM ROSTER PAGES**************


//initial roster page, where coach first puts in his roster
exports.roster_fill = function(req, res){
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
				if(err) {
					// throw new Error(err);
					res.redirect("/404");
				}else{
			    	res.render('team/roster_fill', {
			    		title: "Add players",
			    	  team: team,
			    	  user: req.user
			    	});
				}
			}
		});
  	});

};


//post
exports.roster_create = function(req, res){

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
				User.getByEmail(req.param('email'), function(err, usr){	//need to check if supplied email is a user
					if(err) res.redirect("/404");


					if(usr){//user exists
						//find player by user and name
						var index = null;
						Family.getPlayersForUser(usr._id, function(players){

							for(var ii=0; ii<players.length; ii++){
								if(players[ii].first_name == req.param('first_name')){	//only checking the first name
									index = ii;
								}
							}

							if(index != null){	//if player already exists, link it to team
								var existing_player = players[index];

								var spot = new RosterSpot({
									player_id: existing_player._id,
									team_id: team._id
								});

								spot.save(function(err, roster_spot){	//roster spot created

								 	//email sent
										Event.getUpcomingByTeamId(team._id, function(err, events){	//get upcoming events
											events.forEach(function(event){
												var att = new Attendance();		//create new attendance
												att.event_id = event._id;
												att.roster_spot_id = roster_spot._id;

												att.save(function(err, attendance){
													if(err) console.log(err);
													console.log(attendance);
												})

											})
										})//event upcoming

									 	console.log("existing player");
										ExistingPlayer.sendMail(req.user, team, existing_player, usr, function(){
												res.redirect('teams/'+req.params.id);
										});
								});


							}else{		//if player doesn't exist, create it and link it to family and roster
								var new_player = new Player({
									first_name: req.param('first_name'),
									last_name: req.param('last_name')
								});

								new_player.save(function(err, player){	//new player created
									console.log(player);
									var fam = new Family({
										user_id: usr._id,
										player_id: player._id
									});

									fam.save(function(err, fam){	//new family created

										var spot = new RosterSpot({
											player_id: player._id,
											team_id: team._id
										});

										spot.save(function(err, roster_spot){	//roster spot created

											//email sent
											Event.getUpcomingByTeamId(team._id, function(err, events){	//get upcoming events
												events.forEach(function(event){
													var att = new Attendance();		//create new attendance
													att.event_id = event._id;
													att.roster_spot_id = roster_spot._id;

													att.save(function(err, attendance){
														if(err) console.log(err);
														console.log(attendance);
													})

												})
											})//event upcoming

												console.log("new player");
												NewPlayer.sendMail(req.user, team, player, usr, function(){
														res.redirect('teams/'+req.params.id);
												});

										});
									});
								});
							}
						});

					}else{	//user does not exist, so make one so we can email them through the system

						var random_password = User.generateRandomPassword();

						var new_user = new User({		//user's password needs to be sent to them
							email: req.param('email'),
							active: false,
							password: random_password,
							last_name: req.param('last_name')//assuming they have the same last name as the player
						});

						new_user.save(function(err, usr){	//new user created

							var new_player = new Player({
									first_name: req.param('first_name'),
									last_name: req.param('last_name')
								});

								new_player.save(function(err, player){	//new player created
									var fam = new Family({
										user_id: usr._id,
										player_id: player._id
									});

									fam.save(function(err, fam){	//new family created

										var spot = new RosterSpot({
											player_id: player._id,
											team_id: team._id
										});

										spot.save(function(err, roster_spot){	//roster spot created

											//email sent
											Event.getUpcomingByTeamId(team._id, function(err, events){	//get upcoming events
												events.forEach(function(event){
													var att = new Attendance();		//create new attendance
													att.event_id = event._id;
													att.roster_spot_id = roster_spot._id;

													att.save(function(err, attendance){
														if(err) console.log(err);
														console.log(attendance);
													})

												})
											})//event upcoming

											console.log("new user");
											NewUserAdded.sendMail(req.user, team, player, usr, random_password, function(){
													res.redirect('teams/'+req.params.id);
											});

										});
									});
								});

						});


					}//end else
				});
			}//auth else
		});//coaches
	});
};

//get page, which lists current roster and also accepts additions to roster
exports.roster = function(req, res){

  	Team.findById(req.params.id, function(err, team){	//get team
  		Coach.getUsersForTeam(team._id, function(err, coaches){	//get coaches
  			var access = false;
  			coaches.forEach(function(c){	//check to see if the user is a coach
  				if(req.user){
	  				if(req.user._id.equals(c._id)){
	  					access = true;
	  				}
	  			}
  			});


  			Event.getByTeamId(team._id, function(err, events){	//get events

  				RosterSpot.getPlayersForTeam(team._id, function(players){	//get players

					if(err) {
						throw new Error(err);
						//res.status(404).render('404');
					}else{
				    	res.render('team/roster', {
				    	  team: team,
				    	  user:req.user,
				    	  events: events,
				    	  players: players,
				    	  coaches: coaches,
				    	  access: access,
				    	  title: team.name
				    	});
					}

				});
			});
  		});

  	});
};


//AJAX
exports.calendar_events = function(req, res){
	Event.getByTeamId(req.params.id, function(err, evs){	//get events
  				var events = [];
  				//formatting the event objects to be displayed in the calendar (fullcalendar.js -- google it)
				evs.forEach(function(obj){
					var noob = {};
				    noob.title = obj.type+'\n'+timeFormat(obj.date)+'\n'+obj.location;
				    noob.start = obj.date;
				    noob.url = '/events/'+obj._id;
				    noob.color = "#FFFFCC";

				    if(obj.type == 'Practice'){
				    	noob.color = "#C3EBFF";
				    }else if(obj.type == 'Game'){
				    	noob.color = "#ADEBAD";
				    }else if(obj.type == 'Meeting'){
				    	noob.color = "#CCCCFF";
				    }else{
				    	noob.color = "#FFFFCC";
				    }
				    events.push(noob);
				});
				res.send(events);
	})
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
