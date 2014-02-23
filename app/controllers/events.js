var mongoose = require('mongoose'),
  Event = mongoose.model('Event');

exports.index = function(req, res){
  Event.find(function(err, events){
    if(err) throw new Error(err);

    res.render('events/index', {
      title: 'Generator-Express MVC',
      events: events
    });
  });
};

exports.new = function(req, res){
    res.render('events/new', {
      title: 'New Event',
    });
};

exports.create = function(req, res){

	var created = new Event({
			name: req.param('name'),
			location: req.param('location'),
			start_time: req.param('time'),
	  		event_type: req.param('type'),
	  		event_num: req.param('event_num')
		})
	created.save(function(err, created_object){
		if(err){
			console.log(err);
		}
		res.redirect('/events');
	});
};