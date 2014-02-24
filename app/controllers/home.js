// var mongoose = require('mongoose'),
//   Article = mongoose.model('Article');
var mailer = require('../mailers/team_mailer');

exports.index = function(req, res){
  res.render('home/index', {
    title: 'Generator-Express MVC'
  });
};

exports.send_mail = function(req, res) {
	var sender = "alexander.egan@gmail.com";
	var reciever = "aegan@andrew.cmu.edu";
	var subject = "Team Mailer Test";
	var text = "I am testing the node mailer";
	var html = "<b>Hello</b>"
	mailer.sendMail(sender, reciever, subject, text, html, function(err, response) {
		if(err) {
			console.log(err);
		}
		return res.render('home/mail-response', {error: err});
	});
}