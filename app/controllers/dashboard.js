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
    return res.render('dashboard/index');
  }
  Coach.getTeamsForUser(req.user._id, function(err, coachedTeams) {
    var coachEvents = [];
    async.each(coachedTeams, function(coachTeam, innerCallback) {
      Event.getByTeamId(coachTeam._id, function(err, events) {
        async.each(events, function(oneEvent, innerCallbackTwo) {
          coachEvents.push({'team': coachTeam, 'event': oneEvent, 'date': oneEvent.date, 'time': oneEvent.date});
          innerCallbackTwo();
        }, function(asyncErrorTwo) {
          innerCallback();
        });
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
    }, function(asyncError) {
      var playerEvents = [];
      Family.getPlayerIdsForUser(req.user._id, function(players) {
        async.each(players, function(player, innerCallbackThree) {
          RosterSpot.getTeamsForPlayer(player, function(teams) {
            async.each(teams, function(team, innerCallbackFour) {
              Event.getByTeamId(team._id, function(err, oneTeamsEvents) {
                async.each(oneTeamsEvents, function(oneTeamEvent, innerCallbackFive) {
                  playerEvents.push({'team': team, 'event': oneTeamEvent, 'date': oneTeamEvent.date, 'time': oneTeamEvent.date});
                  innerCallbackFive();
                }, function(lastAsyncError) {
                  innerCallbackFour();
                });
              });
            }, function(asyncErrorAgain) {
              innerCallbackThree();
            })
          });
      }, function(asyncError){
        return res.render('dashboard/index', {
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





     



// exports.err = function(req, res){
//   res.render('404', {
//     title: 'Generator-Express MVC',
//     user: req.user
//   });
// };