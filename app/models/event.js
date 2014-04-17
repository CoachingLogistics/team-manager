/*
 * This is the event model, which creates an event connected to a team.
 *
 */


// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
})

var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId,
   Mixed = Schema.Types.Mixed;
var Team = mongoose.model('Team');
//var Attendance = mongoose.model('Attendance');
//var Coach = mongoose.model('Coach');

var EventSchema = new Schema({
    team_id: {type: ObjectId, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: false},
    type: {type: String, required: false},
    description: {type: String, default: "no description"},
    latitude: {type:Number, default:null },
    longitude: {type:Number, default:null },
    reminder: {type:Mixed, default:null},
    results: {type:Mixed, default:null}
});

//for scheduled emails
var schedule = require('node-schedule');
var mailer = require('../mailers/team_mailer.js');
var EventReminder = require('../mailers/event_attendance');

//for googlemaps
var gmaps = require('googlemaps');
gmaps.config('key', 'AIzaSyA645rwcj_NE3CJnO83xX2CQ9ef7n4XWwI');

//returns the "HH:MM AM/PM" format for an event's Date object
EventSchema.virtual('time').get(function() {
	var hours = this.date.getHours();
	var time = "AM";
	var minutes = this.date.getMinutes();
	if(this.date.getHours() > 12){
		hours = +this.date.getHours() - 12;
		time="PM";
	}else if(this.date.getHours() == 12){
		time="PM";
	}

	if(this.date.getMinutes() == 0){
		minutes = "00";
	}

	return hours+":"+minutes+" "+time;
});


//returns events for a given team_id
EventSchema.statics.getByTeamId = function(team_id, callback) {
	this.find({team_id: team_id}).sort({date: 1}).execFind(function(err,events){
		callback(err, events);
	});
};



var today = new Date();
//returns events that happen today or in the future for a given team_id
EventSchema.statics.getUpcomingByTeamId = function(team_id, callback) {
	this.find({$and : [{team_id: team_id}, {date: {$gte: today}}] }).sort({date: 1}).execFind(function(err,events){
		callback(err, events);
	});
};

//returns an events team
EventSchema.methods.getTeam = function (callback) {
	Team.findOne({_id: this.team_id}, function(err, team){
		callback(err, team);
	})
};


//calculates the event location's longitude and latitude whenever the location is modified
EventSchema.pre('save', function(next){
	var event = this;
	if(!event.isModified('location')) return next();

	gmaps.geocode(event.location, function(err, returned){
		console.log(returned.status);
		if(returned){
			if(returned.status == 'OK'){

				var coords=returned.results[0].geometry.location;//is an object in format {"lat":####, "lng":####}

				event.latitude = coords.lat;
				event.longitude = coords.lng;
				next();
			}else{
				next();
			}
		
		}else{
			alert("Geocode was not successful, try again later");
			next();//lat and lon are both NULL
		}
	}, 'false');//this is a param that states if the request involves a geolocation device
});


//updates the automated emails if the event date changes
EventSchema.pre('save', function(next){
	var event = this;
	if(!event.isModified('date')) return next();

	//delete any previous emails
	if(event.reminder) schedule.cancelJob(event.reminder.name);
	if(event.results) schedule.cancelJob(event.results.name);

	var two_days_before = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate()-2, 12, 0, 0);	//sends out RSVP reminder 2 days in advance
	var one_day_before = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate()-1, 12, 0, 0);	//set for 1 day before event at noon

	// for manual testing purposes
	// var now = new Date();
	// var two_days_before = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()+1, 0);
	// var one_day_before = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()+1, 0);

	event.remind = schedule.scheduleJob(two_days_before, function(){	//need to send reminders to parents about RSVPing

		
	});//job

	event.results = schedule.scheduleJob(one_day_before, function(){	//this gets carried out whenever the job is scheduled

		//need coaches, team
		event.getTeam(function(err, team){
			Coach.getUsersForTeam(team._id, function(err, coaches){
				Attendance.getPlayerAttendanceForEvent(event._id, function(err, attending, skipping, none){

					EventReminder.sendMail(coaches, team, event, dateFormat(event.date), attending, skipping, none, function(){
						console.log("email reminder sent now");
					});
				});
			});
		});
	});

	event.markModified('remind');
	event.markModified('results');
	next();

});



//deletes the scheduled jobs if an event is deleted
EventSchema.pre('remove', function(next){
	var event = this;

	if(event.reminder) schedule.cancelJob(event.reminder.name);
	if(event.results) schedule.cancelJob(event.results.name);

	next();
});



mongoose.model('Event', EventSchema);
module.exports = mongoose.model('Event', EventSchema);



//helpers
var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

var timeFormat = function(date) {
    var time = "AM";
	var hour = date.getHours();
	if( date.getHours()>=12){
		if(date.getHours()>12){
			hour =  date.getHours()-12;
		}else{
			hour = 12;
		}

		time="PM";
	}

	var minutes = date.getMinutes();
	if(date.getMinutes() == 0){
		minutes = "00";
	}

	return hour+":"+minutes+" "+time;
};
