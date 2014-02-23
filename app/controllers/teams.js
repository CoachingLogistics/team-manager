var mongoose = require('mongoose'),
  Team = mongoose.model('Team');

exports.index = function(req, res){
  Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('team/index', {
      title: 'Teams',
      teams: teams
    });
  });
};