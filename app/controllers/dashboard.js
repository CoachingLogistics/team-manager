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

var  Event = mongoose.model('Event');

//for automated emails
var schedule = require('node-schedule');
var EventReminder = require('../mailers/event_attendance');


var mailer = require('../mailers/team_mailer.js');
var NewUserAdded = require('../mailers/new_added_user');
var ExistingPlayer = require('../mailers/existing_player');
var NewPlayer = require('../mailers/new_player');
var NewCoach = require('../mailers/new_coach');
var ExistingCoach = require('../mailers/existing_coach');
var async = require('async');











exports.index = function(req, res){
  if(!req.user) {
    return res.redirect('/');
  }
  // get the teams the coach is coaching
  Coach.getTeamsForUser(req.user._id, function(err, coachedTeams) {
    var coachEvents = [];
    // go through each team
    async.each(coachedTeams, function(coachTeam, innerCallback) {
      Event.getByTeamId(coachTeam._id, function(err, events) {
        // add each event to the array we are sending to views
        async.each(events, function(oneEvent, innerCallbackTwo) {
          coachEvents.push({'team': coachTeam, 'event': oneEvent, 'date': dateFormat(oneEvent.date), 'time': timeFormat(oneEvent.date)});
          innerCallbackTwo();
        }, function(asyncErrorTwo) {
          innerCallback();
        });
      });
    }, function(asyncError) {
      // now that we have all of the coach events, we need the player events
      var playerEvents = [];
      // get the players for the logged in user
      Family.getPlayerIdsForUser(req.user._id, function(players) {
        // for each player get their teams
        async.each(players, function(player, innerCallbackThree) {
          RosterSpot.getTeamsForPlayer(player, function(teams) {
            // for each team get its events
            async.each(teams, function(team, innerCallbackFour) {
              Event.getByTeamId(team._id, function(err, oneTeamsEvents) {
                // for each event, add it to the playerEvents array
                async.each(oneTeamsEvents, function(oneTeamEvent, innerCallbackFive) {
                  playerEvents.push({'team': team, 'event': oneTeamEvent, 'date': dateFormat(oneTeamEvent.date), 'time': timeFormat(oneTeamEvent.date)});
                  innerCallbackFive();
                }, function(lastAsyncError) {
                  innerCallbackFour();
                });
              });
            }, function(asyncErrorAgain) {
              innerCallbackThree();
            })
          });
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
		        return res.render('dashboard', {
		        	title: "Dashboard",
		          'user': req.user,
		          'coachedTeams': coachedTeams,
		          'playerTeams': playerTeams,
		          'coachEvents': coachEvents,
		          'playerEvents': playerEvents
		        });
		      });
		    });
		  });
        });
      });
    });
  });
};








     


//helpers
var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
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
}

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