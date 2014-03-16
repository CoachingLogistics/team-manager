var mongoose = require('mongoose'),
  Event = mongoose.model('Event');
  Team = mongoose.model('Team');

exports.index = function(req, res){
  Event.find(function(err, events){
    if(err) throw new Error(err);
    res.render('event/index', {
      events: events,
      user:req.user
    });
  });
};

exports.new = function(req, res){
	Team.find(function(err, teams){
    if(err) throw new Error(err);
    res.render('event/new', {
      teams: teams,
      user:req.user
    });
  });
};

exports.team_event = function(req, res){
	Team.findById(req.params.id, function(err, team){
    if(err) throw new Error(err);
    res.render('event/team_event', {
      team: team,
      user:req.user
    });
  });
};


exports.create = function(req, res){

	var hour = req.param('hour');
	if(req.param('time')=="pm"){ hour= +hour + 12; }
	if(req.param('time')=="am" && req.param('hour')==12){ hour = 0; }
	var date = new Date(req.param('year'), req.param('month'), req.param('day'), hour, req.param('minute'));

	// var hour = req.param('time').getHours();
	// var minute = req.param('time').getMinutes();
	// var year = req.param('date').getFullYear();
	// var month = req.param('date').getMonth();
	// var day = req.param('date').getDate();
	var newEvent = new Event({
		team_id: req.param('team_id'),
		date: date,
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
				message: err,
				user:req.user
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

			var time = "AM";
			var hour = event.date.getHours();
			if(event.date.getHours()>=12){
				hour = event.date.getHours()-12;
				time="PM";
			}

			Team.findById(event.team_id, function(err, team){
    			if(err) throw new Error(err);
		    	res.render('event/show', {
		    	  event: event,
		    	  team: team,
		    	  user:req.user,
		    	  time: time,
		    	  hour: hour
		    	});
		    })		 	
		}
  	});
}

exports.edit = function(req, res) {
	Event.findById(req.params.id, function(err, event) {
		if(err) {
			return res.status(404).render('404', {user:req.user});
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

					var time = "AM";
					var hour = event.date.getHours();
					if(event.date.getHours()>=12){
						hour = event.date.getHours()-12;
						time="PM";
					}

					return res.render('event/edit', {
						event: event,
						month: month_name,
						team: team,
						teams: teams,
						user:req.user,
						'error': null,
						time: time,
						hour: hour
					});
				})
			})
		}
	});
}

exports.update = function(req, res){
	var hour = req.param('hour');
	if(req.param('time')=="pm"){ hour= +hour + 12; }
	if(req.param('time')=="am" && req.param('hour')==12){ hour = 0; }
	var date = new Date(req.param('year'), req.param('month'), req.param('day'), hour, req.param('minute'));

		Event.findById(req.params.id, function(error, event){

	  		event.date = date;
			event.location = req.param('location');
			event.type = req.param('type');

			event.save(function(err, event){
				if(err){
					console.log(err);
					res.redirect('/');
				}else{
					res.redirect('/events/' + event._id);	
				}

			});
		});
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



