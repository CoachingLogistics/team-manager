var mongoose = require('mongoose');
var RosterSpot = mongoose.model('RosterSpot');
var Event = mongoose.model('Event');
var Player = mongoose.model('Player');
var Family = mongoose.model('Family');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
// will work in email templates later, for now just get this working

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
          Family.getUsersForPlayer(player_id, function(err5, users) {
            var emailAddress = users[0].email;
            // now I have the email address and attendance, so sent it to the mailer to ask for response
            team_mailer.ask_attendance(emailAddress, theAttendance._id, function(emailErr, message) {
              res.redirect('attendance/emailSent');
            });
          });
        });
      });
    });
  });
}

// records the attendance response
exports.record_response = function(req, res) {
  var response = req.params.attending;
  var attendance_id = req.params.attendanceid;
  // the user can go
  if(attending == 't') {
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
