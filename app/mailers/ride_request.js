
//this is the mailer used when a player requests a ride to an event

var nodemailer = require("nodemailer");
var mailer_options = require("../../config/mailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: mailer_options.service,
  auth: {
    user: mailer_options.user,
    pass: mailer_options.pass
  }
});

/*
 * Sends an email to all parents of a team when someone requests
 * a ride to an event.
 * user: the user getting the email
 * team: the team the email concerns
 * player: the player requesting a ride
 * event: the event the player needs a ride for
 * rider: the rider object
 * callback: the callback function
 */
exports.send_mail = function(user, team, player, event, rider, callback) {
  // make this variable so it doesn't say "needs a ride to the other" which wouldn't make sense
  var type = event.type.equalsIgnoreCase("other") ? "upcoming event" : event.type;

  // the text and html for the email
  var text = "Hello " + user.name + ",\n\t You are receiving this email because " + player.full_name + " has requested a ride for ";
      text += " the upcoming " + type + " for " + team.name + " " + team.sport + ". The event is taking place on ";
      text += dateFormat(event.date) + " at " + timeFormat(date) + ", and will be held at " + event.location + ".";
      text += "\n\t" + player.full_name + " would like to be picked up at " + rider.location + " by " + rider.time + ".";
      text += "If you are able to drive " + player.full_name + " to the " + type + ", please add them to a carpool at ";
      text += "http://production-teammanager.rhcloud.com/events/" + event._id + " .";
      text += "\nThank you,\n " + team.name + " at Team Manager";
  var html = "Hello " + user.name + ",<br /> You are receiving this email because " + player.full_name + " has requested a ride for ";
      html += " the upcoming " + type + " for " + team.name + " " + team.sport + ". The event is taking place on ";
      html += dateFormat(event.date) + " at " + timeFormat(date) + ", and will be held at " + event.location + ".";
      html += "<br />" + player.full_name + " would like to be picked up at " + rider.location + " by " + rider.time + ".";
      html += "If you are able to drive " + player.full_name + " to the " + type + ", please add them to a carpool at ";
      html += "<a href='http://production-teammanager.rhcloud.com/events/" + event._id + "'>On the Team Manager site</a>.";
      html += "<br />Thank you,<br /> " + team.name + " at Team Manager";
  // setting email options
  var email_sender = player.full_name;
  var subject = "" + player.full_name + " needs a ride for an event";

  //from is the current coach's name & email
  var mailOptions = {
    from: email_sender,
    to: user.email,
    subject: subject,
    text: text,
    html: html
  };

  // actually send the email
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        callback(error, "Message not sent");
    }else{
        console.log("Message sent: " + response.message);
        callback(error, response);
    }
  });
}


//helpers for date and type formatting
var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

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
