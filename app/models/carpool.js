/*
 * This is the carpool model, which connects users to events and riders.
 *
 */

// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
})

//required
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
var	ObjectId = Schema.ObjectId;
var	Player = mongoose.model('Player');
var	Team = mongoose.model('Team');
var	Event = mongoose.model('Event');
var	RosterSpot = mongoose.model('RosterSpot');



var CarpoolSchema = new Schema({
	user_id: {type: ObjectId, required: true},
	event_id: {type: ObjectId, required: true},
	location: {type: String},
	time: {type: Date},
	size: {type: Number, required: true}
});



//returns the user object for a carpool
CarpoolSchema.methods.getUser =  function(callback) {
	User.findById(this.user_id, function(err, user){
		callback(err, user);
	});
};

//returns the event object for a carpool
CarpoolSchema.methods.getEvent =  function(callback) {
	Event.findById(this.event_id, function(err, event){
		callback(err, event);
	});
};


//get time formatted string
CarpoolSchema.methods.getTime =  function(callback) {
	var date = this.time;
	var time = "AM";
  	var hour = date.getHours();
  	if( date.getHours()>=12){
   		hour =  date.getHours()-12;
    	time="PM";
  	}
  	var minutes = date.getMinutes();
  	if(date.getMinutes() == 0){
    	minutes = "00";
  	}

  	return hour+":"+minutes+" "+time;
};



//returns carpools for a given event_id and user_id (hopefully 1 or none)
CarpoolSchema.statics.getByIds = function(user_id, event_id, callback) {
	this.findOne({ $and: [ {event_id: event_id}, {user_id: user_id}]}, function(err, carpool){
		callback(err, carpool);

	});
};


//  returns an array of carpool Objects for a user_id
CarpoolSchema.statics.getByUserId = function(user_id, callback) {
	this.find({user_id: user_id}, function(err, rosters){
		callback(err, rosters);
	});
};

//  returns an array of carpool Objects for a given event_id
CarpoolSchema.statics.getByEventId = function(event_id, callback) {
	this.find({event_id: event_id}, function(err, rosters){
		callback(err, rosters);
	});
};

//for team?





mongoose.model('Carpool', CarpoolSchema);
module.exports = mongoose.model('Carpool', CarpoolSchema);