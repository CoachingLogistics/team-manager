var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Email_Template = mongoose.model('Email_Template');

exports.new = function(req, res) {
  res.render('email_template/new', {'id': req.params.id});
};

exports.create = function(req, res) {
  var team_id = req.params.id;
  var body = req.body.body
  var subject = req.body.subject;
  var recipients = req.body.recipients.split(',');
  var template = new Email_Template({
    'team_id': team_id,
    'body': body,
    'subject': subject,
    'recipients': recipients
  });
  template.save(function(err, saved) {
    if(err) {
      return res.redirect('/teams/' + team_id + '/newTemplate');
    }
    res.render('email_template/show', {'template': saved});
  });
};

exports.index = function(req, res) {
  var team_id = req.params.id;
  Email_Template.getByTeamId(team_id, function(err, docs) {
    if(err) {
      return res.redirect('/teams/' + team_id);
    }
    res.render('email_template/index', {'templates': docs, 'team_id': team_id});
  });
};

exports.show = function(req, res) {
  var template_id = req.params.temp_id;
  Email_Template.findById(template_id, function(err, returned) {
    if(err) {
      return res.redirect('/teams/' + req.params.id + '/templates');
    }
    else {
      return res.render('email_template/show', {'template': returned});
    }
  });
};

exports.delete = function(req, res) {
  var template_id = req.params.temp_id;
  Email_Template.remove({'_id': template_id}, function(err, docs) {
    if(err) {
      return res.redirect('/teams/' + req.params.id + '/templates/' + template_id);
    }
    else {
      return res.redirect('/teams/' + req.params.id + '/templates');
    }
  });
}