
//this is a mailer to record RSVPs from users for a given event

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
// user is the current coach
// guardian is the user that is a parent to the player

exports.ask_attendance = function(user, guardian, attendance_id, team, event, callback) {
  var text = "Hello " + guardian.name + ", \n" + team.name + " " + team.sport + " has scheduled a " + event.type + " for " + event.date + ". This event will take place ";
  text += "at " + event.location + ". \nPlease respond to this RSVP to let " + user.name + " know if you will be able to attend.\n";
  text += "If you can attend, please go to this link: http://production-teammanager.rhcloud.com/attendance/" + attendance_id + "/t \n";
  text += "If you can not attend, please go to this link: http://production-teammanager.rhcloud.com/attendance/" + attendance_id + "/f";

  var html = "Hello " + guardian.name + ", <br>" + team.name + " " + team.sport + " has scheduled a " + event.type + " for " + event.date + ". This event will take place ";
  html += "at " + event.location + ". <br>Please respond to this RSVP to let " + user.name + " know if you will be able to attend.<br>";
  html += "<a href='http://production-teammanager.rhcloud.com/attendance/" + attendance_id + "/t'>I can attend this event</a> <br>";
  html += "<a href='http://production-teammanager.rhcloud.com/attendance/" + attendance_id + "/f'>I can not attend this event</a> <br>";


  //from is the current coach's email
  var mail_options = {
    from: "" + user.name + " <" + user.email + " >",
    to: guardian.email,
    subject: "Attendance Information",
    'text': text,
    'html': html
  };

  
  smtpTransport.sendMail(mail_options, function(err, response) {
    if(err) {
      console.log(err);
      return callback(err, "Message not sent");
    }
    else {
      callback(err, response);
    }
  });
}
