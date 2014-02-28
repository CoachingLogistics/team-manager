var mongoose = require('mongoose'),
  Event = mongoose.model('Event');
  Team = mongoose.model('Team');

exports.index = function(req, res){
  Event.find(function(err, events){
    if(err) throw new Error(err);
    res.render('event/index', {
      events: events
    });
  });
};

exports.new = function(req, res){
	Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('event/new', {
      teams: teams
    });
  });
};

exports.create = function(req, res){
	console.log(req.param('team_id'));
	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
	var time_string = "" + req.body.hour + ":" + req.body.minute;
	var newEvent = new Event({
		// team_id: req.param('team_id'),
		date: new Date(date_string),
		time: new Date(time_string),
		location: req.body.location,
  		type: req.param('type')
	});
	newEvent.save(function(err, event){
		if(err){
			console.log(err);
			res.render('event/new', {
				event: event,
				message: err
			});
		}else{
			res.redirect('/events/' + event._id //, {
			//	event: event,
			//	message: "You have successfully created team " + team.name
			//}
			);
		}

	});
};

exports.show = function(req, res){
	//remember to put the id of the event in the request data
  	Event.findById(req.params.id, function(err, event){
		if(err) {
			throw new Error(err);
			//res.status(404).render('404');
		}else{
	    	res.render('event/show', {
	    	  event: event
	    	});			
		}

  	});
};

exports.edit = function(req, res) {
	Event.findById(req.params.id, function(err, event) {
		if(err) {
			return res.status(404).render('404');
		}
		else {
			var month_name;
			if(event.date) {
				var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				month_name = monthNames[event.date.getMonth()];
			}
			return res.render('event/edit', {event: event, month: month_name, 'error': null});
		}
	})
}

exports.update = function(req, res){
	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
	var time_string = "" + req.body.hour + ":" + req.body.minute;
	Event.findById(req.params.id, function(error, event){
		var oldEvent = JSON.parse(JSON.stringify( event ));

		// event.team_id = req.body.team_id;
		// team_id: req.param('team_id'),
  		event.date = new Date(date_string);
  		event.time = new Date(team_string);
		event.location = req.body.location;
		event.type = req.body.type;

		event.save(function(err, event){
			if(err){
				res.render('event/edit', {
					event: oldEvent,
					message: err
				});
			}else{
				res.redirect('/events/' + event._id);	
			}
		})
	})
};

exports.delete = function(req, res) {
	Event.remove({_id: req.params.id}, function(err, docs) {
		if(err) {
			return res.redirect('/events/' + req.params.id);
		}
		else {
			return res.redirect('/events');
		}
	});
}