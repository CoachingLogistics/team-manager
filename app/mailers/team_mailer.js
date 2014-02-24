var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "alexander.egan@gmail.com",
    pass: "password here"
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