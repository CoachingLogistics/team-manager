// var mongoose = require('mongoose'),
//   Article = mongoose.model('Article');


exports.index = function(req, res){
  res.render('home/index', {
    title: 'Generator-Express MVC',
    user: req.user
  });
};

exports.err = function(req, res){
  res.render('404', {
    title: 'Generator-Express MVC',
    user: req.user
  });
};

exports.about = function(req, res){
  res.render('home/about', {
    title: 'Generator-Express MVC',
    user: req.user
  });
};


exports.features = function(req, res){
  res.render('home/features', {
    title: 'Generator-Express MVC',
    user: req.user
  });
};


exports.starting = function(req, res){
  res.render('home/starting', {
    title: 'Generator-Express MVC',
    user: req.user
  });
};