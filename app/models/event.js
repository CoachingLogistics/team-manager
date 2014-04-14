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
   ObjectId = Schema.ObjectId;
var Team = mongoose.model('Team');

var EventSchema = new Schema({
    team_id: {type: ObjectId, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: false},
    type: {type: String, required: false},
    description: {type: String, default: "no description"},
    latitude: {type:Number, default:null },	//needs testing
    longitude: {type:Number, default:null } //needs testing
});

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



mongoose.model('Event', EventSchema);
module.exports = mongoose.model('Event', EventSchema);