/*
 * Proof of concept. We can get emails to work
 * Please remember to not commit the password to your email account.
 * I'll work on moving that information into a file that is included in .gitignore
 * http://www.nodemailer.com/ for more info
 */

var nodemailer = require("nodemailer");
var mailer_options = require("../../config/mailer");
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: mailer_options.service,
  auth: {
    user: mailer_options.user,
    pass: mailer_options.pass
  }
});

// send mail with defined transport object
exports.sendMail = function(from, to, subject, text, html, callback) {
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        callback(error, "Message not sent");
    }else{
        console.log("Message sent: " + response.message);
        callback(error, response);
    }
  });
};


exports.added_to_team = function(email_address, team_id, callback) {
  Team.findById(team_id, function(err, the_team) {
    // the message, however we want to have it displayed
    // we may also want to have an email template just for this, but not sure it is necessary
    var msg = "Welcome to the " + the_team.name + " " + the_team.sport + " team manager system!
    This email is informing you that you have been added to the teaam";
    // mail options. My name is in there for testing purposes
    var mailOptions = {
        from: "Alex Egan <alexander.egan@gmail.com>",
        to: email_address,
        subject: the_team.name + " " + the_team.sport,
        text: msg,
        html: msg,
    };
    // send the mail
    smtpTransport.sendMail(mailOptions, function(err, response) {
      if(err) {
          console.log(err);
          callback(err, "Message not sent");
      }
      else {
        // err should be undefined here, but the callback should have an error and response parameters just incase
          callback(err, response);
      }
    });
  });
};
