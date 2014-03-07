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
var Player = mongoose.model('Player');

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

// this message is sent when an existing player (and therefore user) is added to a new team
// and a roster spot is created.
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
          return callback(err, "Message not sent");
      }
      else {
        // err should be undefined here, but the callback should have an error and response parameters just incase
          return callback(err, response);
      }
    });
  });
};

// adds player and spot
exports.player_and_spot_added = function(email_address, player_id, team_id, callback) {
  Team.findById(team_id, function(err1, the_team) {
    Player.findById(player_id, function(err2, the_player) {
      var name = the_team.name;
      var sport = the_team.sport;
      var player_name = the_player.full_name;
      var msg = "You have successfully added " + player_name + " to the system, and " + player_name + " has been
      added to the team " + name + " " + sport + ". Thank you for using team manager";
      var mail_options = {
        from: "Alex Egan <alexander.egan@gmail.com>",
        to: email_address,
        subject: the_team.name + " " + the_team.sport,
        text: msg,
        html: msg,
      };
      smtpTransport.sendMail(mail_options, function(err3, response) {
        if(err3) {
          console.log(err3);
          return callback(err3, "Message not sent");
        }
        else {
          // will not have an error at this point, but the callback should account for one
          return callback(err3, response.message);
        }
      });
    });
  });
};

// adds a new player and family
exports.family_added = function(email_address, player_id, team_id, callback) {
  Team.findById(team_id, function(err1, the_team) {
    Player.findById(player_id, function(err2, the_player) {
      var name = the_team.name;
      var sport = the_team.sport;
      var player_name = the_player.full_name;
      var msg = "You have successfully added " + player_name + " to the system under your account, and " +
      player_name + " has been added to " + name + " " + sport + ". Thank you for using team manager!";
      var mail_options = {
        from: "Alex Egan <alexander.egan@gmail.com>",
        to: email_address,
        subject: the_team.name + " " + the_team.sport,
        text: msg,
        html: msg,
      };
      smtpTransport.sendMail(mail_options, function(err3, response) {
        if(err3) {
          console.log(err3);
          return callback(err3, "Message not sent");
        }
        else {
          // again, no error here but callback should account for one
          return callback(err3, response.message);
        }
      });
    });
  });
}
