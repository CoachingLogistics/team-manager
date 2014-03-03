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
	console.log(req.body);
	var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
	var time_string = "" + req.body.hour + ":" + req.body.minute;
	var newEvent = new Event({
		team_id: req.param('team_id'),
		date: new Date(date_string),
		time: new Date(time_string),
		location: req.body.location,
  		type: req.param('type')
	});
	newEvent.save(function(err, event){
		if(err){
			console.log(err);
			Team.find(function(err, teams){
    			if(err) throw new Error(err);
			res.render('event/new', {
				event: event,
				teams: teams,
				message: err
			});
			});
		}else{
			res.redirect('/events/' + event._id);
		}
	});
};

exports.show = function(req, res){
  	Event.findById(req.params.id, function(err, event){
		if(err) {
			throw new Error(err);
		}else{
			Team.findById(event.team_id, function(err, team){
    			if(err) throw new Error(err);
		    	res.render('event/show', {
		    	  event: event,
		    	  team: team
		    	});
		    })		 	
		}
  	});
}

exports.edit = function(req, res) {
	Event.findById(req.params.id, function(err, event) {
		if(err) {
			return res.status(404).render('404');
		}else {
			Team.findById(event.team_id, function(err, team){
				if(err) throw new Error(err);
				Team.find(function(err, teams){
    				if(err) throw new Error(err);
					var month_name;
					if(event.date) {
						var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
						month_name = monthNames[event.date.getMonth()];
					}
					return res.render('event/edit', {event: event, month: month_name, team: team, teams: teams, 'error': null});
				})
			})
		}
	});
}

exports.update = function(req, res){
	// console.log ("we've got to update");
	// console.log ("dis req " + req);
	// Team.findById(event.team_id, function(err, team){
		if(err) throw new Error(err);
		var date_string = "" + req.body.month + "/" + req.body.day + "/" + req.body.year;
		var time_string = "" + req.body.hour + ":" + req.body.minute;
		Event.findById(req.params.id, function(error, event){
			var oldEvent = JSON.parse(JSON.stringify( event ));
	  		// event.team_id = req.param('team_id'), 
	  		event.date = new Date(date_string);
	  		event.time = new Date(team_string);
			event.location = req.body.location;
			event.type = req.body.type;

			event.save(function(err, event){
				if(err){
					Team.find(function(err, teams){
	    				if(err) throw new Error(err);
						res.render('event/show', {
							event: oldEvent,
							// team: team,
							teams: teams,
							message: err
						});
						});
					}else{
						res.redirect('/events/' + req.params.id);	
					}

				});
			});
		// });
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
