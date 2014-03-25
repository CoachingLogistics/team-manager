//this is for new players added to a team
// (this is similar to existing user mailer)

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
exports.sendMail = function(creator, team, user, callback) {

  var text = "Hello "+ user.first_name + " "+ user.last_name +",\n You are recieving this email because "+ creator.first_name + " "+ creator.last_name + " has just added you as a manager on the "+ team.name+ " " + team.sport + " team on Team Manager.";
  text+= "\nTo view the team page please visit "+" http://production-teammanager.rhcloud.com/teams/"+team._id+" \n";
  text+= "\nAs a manager, you have access to create team events, set the roster, and edit team information.\n";
  text+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";

  var html = "Hello "+ user.first_name + " "+ user.last_name +",<br> You are recieving this email because "+ creator.first_name + " "+ creator.last_name + " has just added you as a manager on the "+ team.name+ " " + team.sport + " team on Team Manager";
  html+= "<br>To view the team page please visit "+" <a href='http://production-teammanager.rhcloud.com/teams/"+team._id+"'>http://production-teammanager.rhcloud.com/teams/"+team._id+"</a> <br>";
  html+= "<br>As a manager, you have access to create team events, set the roster, and edit team information.<br>";
  html+= "Be on the lookout for Team Manager emails regarding the "+ team.name+ " team.  And thanks for using Team Manager!";


  var creator_email = creator.first_name + " " + creator.last_name + "<"+ creator.email+">";
  var subject = "You're a manager on the " + team.name + " Team Manager app";

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