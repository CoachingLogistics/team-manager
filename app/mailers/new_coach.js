
//this is for users who are added to manage a team
//lets them know that an account was created for them, and gives them a password

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
// password should be the randomly generated password
// creator is the current coach of the team, who added this user as a manager
exports.sendMail = function(creator, team, user, password, callback) {

  var text = "Hello Mr./Ms. User,\n You are recieving this email because "+ creator.first_name + " "+ creator.last_name + " has just added you as a manager to the "+ team.name+ " " + team.sport + " team on Team Manager.";
  text+= "\nTeam Manager provides a platform that manages teams through automated emails to keep track of attendance, event scheduling and reminders, and carpool requesting and directions (coming soon).\n";
  text+= "To view the team page please visit "+" http://production-teammanager.rhcloud.com/teams/"+team._id+" \n";
  text+= "As a manager, you have access to create team events, set the roster, and edit team information.\n";
  
  text+= "\nYou can use the following credentials to login to your account and view your teams: \nemail: "+user.email+"\n password: "+ password+ "\n";
  text+= "Please be sure to change your password and update your information once you are logged in.\n\n";
  text+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";

  var html = "Hello Mr./Ms. User,<br> You are recieving this email because "+ creator.first_name + " "+ creator.last_name + " has just added you as a manager to the "+ team.name+ " " + team.sport + " team on Team Manager.";
  html+= "<br>Team Manager provides a platform that manages teams through automated emails to keep track of attendance, event scheduling and reminders, and carpool requesting and directions (coming soon).<br>";
  html+= "To view the team page please visit "+"<a href='http://production-teammanager.rhcloud.com/teams/"+team._id+"'>http://production-teammanager.rhcloud.com/teams/"+team._id+"</a> <br>";
  html+= "As a manager, you have access to create team events, set the roster, and edit team information.<br>";
  
  html+= "<br>You can use the following credentials to login to your account and view your teams: <br>email: "+user.email+"<br> password: "+ password+ "<br>";
  html+= "Please be sure to change your password and update your information once you are logged in.<br><br>";
  html+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";

  var creator_email = creator.first_name + " " + creator.last_name + "<"+ creator.email+">";
  var subject = "You've been added to the " + team.name + " Team Manager app";

  //from is the current coach's name & email
  var mailOptions = {
    from: creator_email,
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