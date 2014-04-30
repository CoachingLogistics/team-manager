var helper = require('./helper/helper_methods');


exports.index = function(req, res){
  res.render('home/index', {
    title: 'Team Manager',
    user: req.user
  });
};

exports.err = function(req, res){
  res.render('404', {
    title: 'Team Manager',
    user: req.user
  });
};

exports.about = function(req, res){
  res.render('home/about', {
    title: 'Team Manager',
    user: req.user
  });
};


exports.features = function(req, res){
  res.render('home/features', {
    title: 'Team Manager',
    user: req.user
  });
};


exports.starting = function(req, res){
  res.render('home/starting', {
    title: 'Team Manager',
    user: req.user
  });
};