
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

// send an email to a user that was just created
exports.newUserCreated = function(new_user, password, existing_user, player, callback) {
  var text = "Hello " + new_user.first_name + " " + new_user.last_name + ",\n You are recieving this email because you have been added as a guardian for "+ player.first_name + " "+ player.last_name + " by " + existing_user.first_name + " " +existing_user.last_name + " in the Team Manager system.";
  text+= "\nNothing else is required for you to start benefiting from the features of the Team Manager app, which include:\n ";
  text+= "Automated emails to keep track of attendance.\n Event scheduling and reminders.\n Carpool requesting and directions (coming soon).";

  text+= "\nTo view your profile please visit "+" http://production-teammanager.rhcloud.com/account\n";
  text+= "You can use the following credentials to login to your account and view your teams: \nemail: "+new_user.email+"\n password: "+ password+ "\n";
  text+= "Please be sure to change your password and update your information once you are logged in.\n\n";
  text+= "Be on the lookout for Team Manager emails regarding the the teams that" + player.first_name + " is a part of.  And thanks for using Team Manager!";

  var html = "Hello " + new_user.first_name + " " + new_user.last_name + ", <br> You are recieving this email because you have been added as a guardian for "+ player.first_name + " "+ player.last_name + " by "+ existing_user.first_name + " " + existing_player.last_name + " in the Team Manager system.";
  html+= "<br>Nothing else is required for you to start benefiting from the features of the Team Manager app, which include:<br> ";
  html+= "<ul><li>Automated emails to keep track of attendance.</li><li> Event scheduling and reminders.</li><li>Carpool requesting and directions (coming soon).</li></ul>";

  html+= "<br>To view your profile please visit "+" <a href='http://production-teammanager.rhcloud.com/account'>http://production-teammanager.rhcloud.com/account</a> <br>";
  html+= "You can use the following credentials to login to your account and view your teams: <br>email: "+new_user.email+"<br> password: "+ password+ "<br>";
  html+= "Please be sure to change your password and update your information once you are logged in.<br><br>"
  text+= "Be on the lookout for Team Manager emails regarding the the teams that" + player.first_name + " is a part of.  And thanks for using Team Manager!";
  // mail options
  var mail_options = {
    'to': new_user.email,
    'from': existing_user.first_name + " " + existing_user.last_name + "<" + existing_user.email">",
    'subject': 'Welcome to Team Manager',
    'text': text,
    'html': html
  };
  // send the email
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        return callback(error, "Message not sent");
    }else{
        return callback(error, response);
    }
  });

}

// send an email to an existing user who just had a new family created
exports.emailExistingUser = function(new_guardian, old_guardian, player, callback) {
  var text = "Hello " + new_guardian.first_name + " " + new_guardian.last_name + ",\n You are recieving this email because you have been added as a guardian for "+ old_guardian.first_name + " "+ old_guardian.last_name + " by " + existing_user.first_name + " " +existing_user.last_name + " in the Team Manager system.\n";
  text += "To view this update please visit your account on http://production-teammanager.rhcloud.com/account\n";
  text += "Thank you for using Team Manager!";

  var html = "Hello "+ new_guardian.first_name + " " + new_guardian.last_name + ",<br> You are recieving this email because you have been added as a guardian for "+ old_guardian.first_name + " "+ old_guardian.last_name + " by " + existing_user.first_name + " " +existing_user.last_name + " in the Team Manager system.<br>";
  html += "To view this update please visit <a href='http://production-teammanager.rhcloud.com/account'>http://production-teammanager.rhcloud.com/account</a><br>";
  html += "Thank you for using Team Manager!";

  // mail options
  var mail_options = {
    'to': new_guardian.email,
    'from': old_guardian.first_name + " " + old_guardian.last_name + "<"+old_guardian.email+">",
    'subject': player.full_name + ' on Team Manager',
    'text': text,
    'html': html
  }
  // send the email
  smtpTransport.sendMail(mailOptions, function(err, response) {
    if(error) {
      console.log(error);
      return callback(error, "Message not sent");
    }
    else {
      return callback(error, response);
    }
  });
}
