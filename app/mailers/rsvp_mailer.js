var nodemailer = require("nodemailer");
var mailer_options = require("../../config/mailer");
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Player = mongoose.model('Player');
var User = mongoose.model('User');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: mailer_options.service,
  auth: {
    user: mailer_options.user,
    pass: mailer_options.pass
  }
});

// asks a user if they can attend an event
exports.ask_attendance = function(email, attendance_id, callback) {
  var mail_options = {
    from: "Team Manager <team.manager.notification@gmail.com>",
    to: email,
    subject: "Attendance Information",
    text: "Are you going to this event?",
    html: "<b>Are you going to this event?</b> <a href='http://localhost:3000/attendance/" + attendance_id + "/t'>Yes</a><br /> <a href='http://localhost:3000/attendance/" + attendance_id + "/f'>No</a>"
  };
  smtpTransport.sendMail(mail_options, function(err, response) {
    if(err) {
      console.log(err);
      return callback(err, "Message not sent");
    }
    else {
      return callback(err, response.message);
    }
  });
}
