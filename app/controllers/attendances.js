var mongoose = require('mongoose');
var RosterSpot = mongoose.model('RosterSpot');
var Event = mongoose.model('Event');
var Player = mongoose.model('Player');
var Family = mongoose.model('Family');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Attendance = mongoose.model('Attendance');
var team_mailer = require('../mailers/team_mailer.js');
var rsvp_mailer = require('../mailers/rsvp_mailer.js');
// will work in email templates later, for now just get this working


// sends emails to all players
exports.email_all = function(req, res) {
  var event_id = req.param('event_id');
  Attendance.getByEventId(event_id, function(err, attendances) {
    attendances.forEach(function(att) {
      // remind those who have not responded
      if(att.attending == null) {
        RosterSpot.findById(att.roster_spot_id, function(err2, rs) {
          rs.getPlayer(function(err3, player) {
            Family.getUsersForPlayer(player._id, function(users) {
              users.forEach(function(user) {
                Event.findById(event_id, function(err, theEvent) {
                  Team.findById(theEvent.team_id, function(err, theTeam) {
                    rsvp_mailer.ask_attendance(req.user, user, att._id, theTeam, theEvent, function(emailErr, message) {
                      //sending emails
                      console.log('sending emails');
                    });
                  });
                });
              });
            });
          });
        });
      }
    }); // end attendances for each
    return res.render('attendance/emailSent', {user: req.user});
  });
}

// finds an attendance for a player and an event and emails a reminder to them
exports.send_email = function(req, res) {
  var event_id = req.param('event_id');
  var player_id = req.param('player_id');
  // need the roster spot id to find the Attendance, need the team to find the roster spot
  Event.findById(event_id, function(err1, found_event) {
    Team.findById(found_event.team_id, function(err2, found_team) {
      RosterSpot.find({'team_id': found_team._id, 'player_id': player_id}, function(err3, docs) {
        // this is the roster spot with the team id and player id, allowing us to find the correct attendance
        var rosterSpot = docs[0];
        Attendance.find({'roster_spot_id': rosterSpot._id, 'event_id': event_id}, function(err4, attendanceDocs) {
          // this is the attendance we need to update
          var theAttendance = attendanceDocs[0];
          // find the email address and send the email if they haven't responded yet
          if(theAttendance.attending == null) {
            Family.getUsersForPlayer(player_id, function(users) {
              // now I have the email address and attendance, so sent it to the mailer to ask for response
              users.forEach(function(user) {
                rsvp_mailer.ask_attendance(req.user, user, theAttendance._id, found_team, found_event, function(emailErr, message) {
                  // sending emails
                  console.log("sending emails");
                });
              });
            });
          }
        });
      });
    });
    res.render('attendance/emailSent', {user: req.user});
  });
}

// records the attendance response
exports.record_response = function(req, res) {
  var response = req.params.response;
  var attendance_id = req.params.attendanceid;
  // the user can go
  if(response == 't') {
    // find the attendance and update the response to be true
    Attendance.findById(attendance_id, function(err, a) {
      if(err) {
        // if there is an error finding the attendance redirect to home
        // I can see this happening in development when responding to an email for the production enviornment
        // and the ID isn't found, so adding this here
        console.log('error finding attendance: ' + a);
        return res.redirect('/');
      }
      a.attending = true;
      a.save(function(err, saved_attendance) {
        res.render('attendance/emailReturn', {user: req.user, attendance: a});
      });
    });
  }
  else { // the user can't go
    Attendance.findById(attendance_id, function(err, a) {
      // find attendance and update the response to be false
      a.attending = false;
      a.save(function(err, saved_attendance) {
        res.render('attendance/emailReturn', {user: req.user});
      });
    });
  }
}

// updates an attendance from the web interface
exports.web_update = function(req, res) {
  var response = req.params.response;
  var event_id = req.params.event_id;
  var player_id = req.params.player_id;
  Event.findById(event_id, function(err, foundEvent) {
    var team_id = foundEvent.team_id;
    RosterSpot.getByIds(team_id, player_id, function(err, roster_spot) {
      Attendance.getByIds(event_id, roster_spot._id, function(err, attendances) {
        var theAttendance = attendances[0];
        if(response == 't') {
          theAttendance.attending = true;
          theAttendance.save(function(saveError, saved) {
            return res.redirect('/events/' + event_id);
          });
        }
        else {
          theAttendance.attending = false;
          theAttendance.save(function(saveError, saved) {
            return res.redirect('/events/' + event_id);
          });
        }
      });
    });

  }); // end Event findById
}


// gets all of the guardians for a player. This is used in event show
// as an ajax call to determine if a logged in user can respond for a player
exports.guardianResponse = function(req, res) {
  //given the player ID and event ID
  var player_id = req.params.player_id;
  var event_id = req.params.event_id;
  // get the family in order determine if the user is the guardian
  Family.getUserIdsForPlayer(player_id, function(userIds) {
    // get the event, roster spot, and attendance to allow the user to record the response
    Event.findById(event_id, function(err, theEvent) {
      RosterSpot.getByIds(theEvent.team_id, player_id, function(err3, rosterSpot) {
        Attendance.find({event_id: event_id, roster_spot_id: rosterSpot._id}, function(err4, attendances) {
          // return the user ids to be used in client side JS for attendances
          var attendance = attendances[0];
          var attendance_id = undefined;
          // in some cases the attendance won't exist because the player was added post event
          if(attendance) {
            attendance_id = attendance._id;
          }
          // determine if a user is logged in
          var userId = undefined;
          if(req.user) {
            userId = req.user._id;
          }
          // send the necessary information to the client
          res.send({
            'guardians': userIds,
            'attendance_id': attendance_id,
            'user_id': userId
          });
        });
      });
    });
  });
}
