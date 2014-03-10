

//this is for existing players added to a team

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

// send mail with defined transport object
exports.sendMail = function(coach, team, player, user, callback) {

  var text = "Hello "+ user.first_name + " "+ user.last_name +",\n You are recieving this email because "+ player.first_name + " "+ player.last_name + " has just been added to the "+ team.name+ " " + team.sport + " team on Team Manager, by " + coach.first_name + " " +coach.last_name;
  text+= "\nTo view the team page please visit "+" http://production-teammanager.rhcloud.com/teams/"+team._id+" \n";
  text+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";

  var html = "Hello "+ user.first_name + " "+ user.last_name +",<br> You are recieving this email because "+ player.first_name + " "+ player.last_name + " has just been added to the "+ team.name+ " " + team.sport + " team on Team Manager, by " + coach.first_name + " " +coach.last_name;
  html+= "<br>To view the team page please visit "+" <a href='http://production-teammanager.rhcloud.com/teams/"+team._id+"'>http://production-teammanager.rhcloud.com/teams/"+team._id+"</a> <br>";
  html+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";


  var coach_email = coach.first_name + " " + coach.last_name + "<"+ coach.email+">";
  var subject = "You've been added to the " + team.name + " Team Manager app";

  var mailOptions = {
    from: coach_email,
    to: user.email,
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
}