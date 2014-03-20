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
      RosterSpot.findById(att.roster_spot_id, function(err2, rs) {
        rs.getPlayer(function(err3, player) {
          Family.getUsersForPlayer(player._id, function(users) {
            users.forEach(function(user) {
              rsvp_mailer.ask_attendance(req.user, user.email, att._id, function(emailErr, message) {
                // emails are sent
              });
            });
          });
        });
      });
    });
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
          // find the email address
          Family.getUsersForPlayer(player_id, function(users) {
            var emailAddress = users[0].email;
            // now I have the email address and attendance, so sent it to the mailer to ask for response
            users.forEach(function(user) {
              rsvp_mailer.ask_attendance(req.user, emailAddress, theAttendance._id, function(emailErr, message) {
                // sending emails
              });
              res.render('attendance/emailSent', {user: req.user});
            });
          });
        });
      });
    });
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
      a.attending = true;
      a.save(function(err, saved_attendance) {
        res.render('attendance/emailReturn', {user: req.user});
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
