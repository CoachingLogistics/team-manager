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
}