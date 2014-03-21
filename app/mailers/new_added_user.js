
//this is for users who are invited to join the 

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
exports.sendMail = function(coach, team, player, user, password, callback) {

  var text = "Hello Mr./Mrs. User,\n You are recieving this email because "+ player.first_name + " "+ player.last_name + " has just been added to the "+ team.name+ " " + team.sport + " team on Team Manager, by " + coach.first_name + " " +coach.last_name;
  text+= "\nNothing else is required for you to start benefiting from the features of the Team Manager app, which include:\n ";
  text+= "Automated emails to keep track of attendance.\n Event scheduling and reminders.\n Carpool requesting and directions (coming soon).";

  text+= "\nTo view the team page please visit "+" http://production-teammanager.rhcloud.com/teams/"+team._id+" \n";
  text+= "You can use the following credentials to login to your account and view your teams: \nemail: "+user.email+"\n password: "+ password+ "\n";
  text+= "Please be sure to change your password and update your information once you are logged in.\n\n";
  text+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";

  var html = "Hello Mr./Mrs. User,<br> You are recieving this email because "+ player.first_name + " "+ player.last_name + " has just been added to the "+ team.name+ " " + team.sport + " team on Team Manager, by " + coach.first_name + " " +coach.last_name;
  html+= "<br>Nothing else is required for you to start benefiting from the features of the Team Manager app, which include:<br> ";
  html+= "<ul><li>Automated emails to keep track of attendance.</li><li> Event scheduling and reminders.</li><li>Carpool requesting and directions (coming soon).</li></ul>";

  html+= "<br>To view the team page please visit "+" <a href='http://production-teammanager.rhcloud.com/teams/"+team._id+"'>http://production-teammanager.rhcloud.com/teams/"+team._id+"</a> <br>";
  html+= "You can use the following credentials to login to your account and view your teams: <br>email: "+user.email+"<br> password: "+ password+ "<br>";
  html+= "Please be sure to change your password and update your information once you are logged in.<br><br>"
  html+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!"


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

