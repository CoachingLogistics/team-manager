var mongoose = require('mongoose');
var RosterSpot = mongoose.model('RosterSpot');
var Event = mongoose.model('Event');
var Player = mongoose.model('Player');
var Family = mongoose.model('Family');
var User = mongoose.model('User');
// will work in email templates later, for now just get this working

// creates an attendance and sends an email in order to record attendance
exports.send_email = function(req, res) {
  // for now thinking test should come in as params, will work out best way as I continue
  // working on it
  var event_id = req.params.event_id;
  var roster_spot_id = req.params.roster_id;
  // new attendance with no response is created
  var new_attendance = Attendance.create({'event_id': event_id, 'roster_spot_id': roster_spot_id});
  new_attendance.save(function(err, saved_attendance) {
    // send email with this saved_attendance ID to email address
    RosterSpot.findById(roster_spot_id, function(err, rs) {
      Family.getUsersForPlayer(rs.player_id, function(users) {
        var theUser = users[0];;
        // team_mailer.ask_attendance(theUser._id, event_id, function(err, response) {
          // what to do here?
          // res.redirect('somewhere');
        //})
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
        // res.redirect('somewhere');
      });
    });
  }
  else { // the user can't go
    Attendance.findById(attendance_id, function(err, a) {
      // find attendance and update the response to be false
      a.attending = false;
      a.save(function(err, saved_attendance) {
        // res.redirect('somewhere');
      });
    });
  }
}
