/*
 * Proof of concept. We can get emails to work
 * Please remember to not commit the password to your email account.
 * I'll work on moving that information into a file that is included in .gitignore
 * http://www.nodemailer.com/ for more info
 */

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
exports.sendMail = function(to, user, password, callback) {

  var text = "Hello " + user.first_name +",\n This is your new password for your account on Team Manager: \n email: "+user.email+"\n password: "+ password+ "\n";
  text+= "Please be sure to change your password once you are logged in.\n Thanks for using Team Manager!"

  var html = "Hello "+ user.first_name + ",<br> This is your new password for your account on Team Manager: <br> email: "+user.email+"<br> password: "+ password+ "<br>";
  html+= "Please be sure to change your password once you are logged in.<br> Thanks for using Team Manager!"


  var mailOptions = {
    from: "TeamManager <admin@teammanager.edu>",
    to: to,
    subject: "Your New TeamManager Password",
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