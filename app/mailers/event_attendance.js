//
//

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
exports.sendMail = function(coaches, team, event, date, attending, skipping, noresponse, callback) {

  var roster_size = attending.length + skipping.length + noresponse.length;

  var text = "Hello coaches of team " + team.name+", \n";
  text += "This is an email reminder for your team's upcoming event: " + event.type + " on "+ date +".\n";
  text+= "As of the sending of this email, the current attendance for this event is a follows:\n\n";
  text+= "Players on Roster: \t"+ roster_size;

  text+= "Attending: \t";
  attending.forEach(function(player, index){
    if(index==attending.length){ text+= player.first_name+" "+player.last_name; }
    else{ text+= player.first_name+" "+player.last_name+", "; }
  });
  text+="\n"

  text+= "Not Attending: \t";
  skipping.forEach(function(player, index){
    if(index==attending.length){ text+= player.first_name+" "+player.last_name; }
    else{ text+= player.first_name+" "+player.last_name+", "; }
  });;

  text+= "Did Not Respond: \t";
  noresponse.forEach(function(player, index){
    if(index==attending.length){ text+= player.first_name+" "+player.last_name; }
    else{ text+= player.first_name+" "+player.last_name+", "; }
  });

  text+=  "To view the event page or send out RSVP reminders, go here: " + "http://production-teammanager.rhcloud.com/events/"+event._id+"    \n";
  text+= "Thank you for using TeamManager, and Go Team"+team.name+"!!!";



  var html = "Hello coaches of team " + team.name+", <br>";
  html += "This is an email reminder for your team's upcoming event: " + event.type + " on "+ date +".<br>";
  html+= "As of the sending of this email, the current attendance for this event is a follows:<br><br>";
  html+= "<b>Players on Roster: </b>"+ roster_size + "<br>";

  html+= "<table border='1' style='border:1px solid black;border-collapse:collapse;'>";
  html+="<thead><th>Attending: "+ attending.length +"</th><th>Not Attending: "+skipping.length+"</th><th>No Response: "+noresponse.length+ "</th></thead>";

  html+= "<tr><td><ul style='list-style: none;'>"
  attending.forEach(function(player, index){
    html+= "<li>"+player.first_name+" "+player.last_name+"</li>"
  });
  html+="</ul></td>"

  html+= "<td><ul style='list-style: none;'>";
  skipping.forEach(function(player, index){
    html+= "<li>"+player.first_name+" "+player.last_name+"</li>"
  });;
  html+="</ul></td>";

  html+="<td><ul style='list-style: none;'>"
  noresponse.forEach(function(player, index){
    html+= "<li>"+player.first_name+" "+player.last_name+"</li>"
  });
  html+="</ul></td></tr></table>"
  html+="<br>"

  html+=  "To view the event page or send out RSVP reminders, go to " + "<a href='http://production-teammanager.rhcloud.com/events/"+event._id+"'>http://production-teammanager.rhcloud.com/events/"+event._id+"</a><br>";
  html+= "Thank you for using TeamManager, and Go Team "+team.name+"!!!";



  var subject = "Event Reminder for "+event.type+" on " + date + ".";
  var coach_emails = [];
  coaches.forEach(function(coach, index){
    coach_emails.push(coach.email);
  })

  //we make the from the current coach of the team

  var mailOptions = {
    from: "TeamManager<team.manager.notification@gmail.com>",
    to: coach_emails,
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