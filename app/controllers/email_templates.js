var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Email_Template = mongoose.model('Email_Template');

// renders the page for a new template
exports.new = function(req, res) {
  res.render('email_template/new', {title: "New Email Template", 'id': req.params.id, 'user': req.user});
};

// attempts to create and save a template
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
    res.redirect('/teams/' + team_id + '/templates/' + saved._id);
  });
};

// renders a list view of all the templates
exports.index = function(req, res) {
  var team_id = req.params.id;
  Email_Template.getByTeamId(team_id, function(err, docs) {
    if(err) {
      return res.redirect('/teams/' + team_id);
    }
    res.render('email_template/index', {title: "Email Templates", 'templates': docs, 'team_id': team_id, 'user': req.user});
  });
};

// renders the show view for email templates
exports.show = function(req, res) {
  var template_id = req.params.temp_id;
  Email_Template.findById(template_id, function(err, returned) {
    if(err) {
      return res.redirect('/teams/' + req.params.id + '/templates');
    }
    else {
      return res.render('email_template/show', {title: "Email Template", 'template': returned, 'user': req.user});
    }
  });
};

// deletes an email template
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

// renders the edit page for an email template
exports.edit = function(req, res) {
  var temp_id = req.params.temp_id;
  Email_Template.findById(temp_id, function(err, docs) {
    if(err) {
      return res.redirect('/teams/' + req.params.id + '/templates');
    }
    else {
      return res.render('email_template/edit', {title: "Edit Email Template", 'template': docs, 'user': req.user});
    }
  });
};

// attemps to update and save an email template
exports.update = function(req, res) {
  var subject = req.body.subject;
  var body = req.body.body;
  var recipients = req.body.recipients;
  if(body && recipients) {
    Email_Template.findById(req.params.temp_id, function(err, returned) {
      if(err) {
        return res.redirect('/teams/'+req.params.id + '/templates');
      }
      else {
        returned.subject = subject;
        returned.body = body;
        returned.recipients = recipients;
        returned.save(function(err, saved) {
          if(err) {
            return res.redirect('/teams/'+req.params.id + '/templates/' + req.params.temp_id + '/edit');
          }
          else {
            return res.redirect('/teams/' + req.params.id + '/templates/' + saved._id);
          }
        });
      }
    });
  }
  else {
    return res.redirect('/teams/'+req.params.id + '/templates/' + req.params.temp_id + '/edit');
  }
}