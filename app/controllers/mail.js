var mailer = require('../mailers/team_mailer');

// controller action for rendering an email sending view
exports.compose_mail = function(req, res) {
	res.render('mail/compose', {
		title: "Mail",
		user: req.user
	});
}

// controller action for sending a message
exports.send_mail = function(req, res) {
	var sender = req.body.sender;
	var reciever = req.body.reciever;
	var subject = req.body.subject;
	var text = req.body.text;
	var html = req.body.html;
	mailer.sendMail(sender, reciever, subject, text, html, function(err, response) {
		if(err) {
			console.log(err);
		}
		return res.render('mail/mail-response', {
			title: 'Team Manager',
			error: err,
			user: req.user
		});
	});
}

// writing these to test the new mail functions in team_mailer
exports.test = function(req, res) {
	mailer.family_added("aegan@andrew.cmu.edu", req.body.player_id, req.body.team_id, function(err, message) {
		res.send("message is " + message);
	});
}
