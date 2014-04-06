/*
 * This is an attendance model, which connects a roster spot to an event for a team.
 *
 */

// loading in required files
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// requirements
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Player = mongoose.model('Player');
var Roster_Spot = mongoose.model('RosterSpot');
var Team = mongoose.model('Team');



// the attendance
var AttendanceSchema = new Schema({
	event_id: {type: ObjectId, required: true},
	roster_spot_id: {type: ObjectId, required: true},
  	attending: {type: Boolean, default: null}	//true: respond yes, false: respond no, null: no repsonse yet
});



// returns an array of Attendance Objects with the specified event_id
AttendanceSchema.statics.getByEventId = function(event_id, callback) {
	this.find({event_id: event_id}, function(err, attendances){
		callback(err, attendances);
	});
};

// returns an array of Attendance Objects with the specified roster_spot_id
AttendanceSchema.statics.getByRosterId = function(roster_spot_id, callback) {
	this.find({roster_spot_id: roster_spot_id}, function(err, attendances){
		callback(err, attendances);
	});
};



//returns an array of Attendances given an event_id and roster_spot_id, most likely be 1 object or none
AttendanceSchema.statics.getByIds = function(event_id, roster_spot_id, callback) {
	this.find({$and: [ {roster_spot_id: roster_spot_id}, {event_id: event_id}] }, function(err, attendances){
		callback(err, attendances);
	});
};

// returns the players for an event
// may not need this, or may need to rework it to make it more useful, but it's here if we need it
AttendanceSchema.statics.getPlayersForEvent = function(event_id, callback) {
	var toReturn = new Array;
	// get every attendance
	this.find({'event_id': event_id}, function(err, attendances) {
		// use async to loop through each one and add it to an array
		async.each(attendances, function(item, innerCallback){
			// gets the roster spots
			Roster_Spot.findById(item.roster_spot_id, function(error, roster_spot) {
				// find the player model
				Player.findById(roster_spot.player_id, function(error2, player) {
					toReturn.push(player);
					innerCallback();
				});
			});
		}, function(err) {
			callback(err, toReturn);
		});
	});
};



//tested
AttendanceSchema.statics.getPlayerAttendanceForEvent = function(event_id, callback) {
	var attending = new Array;
	var skipping = new Array;
	var norespond = new Array;
	// get every attendance
	this.find({'event_id': event_id}, function(err, attendances) {
		// use async to loop through each one and add it to an array
		async.each(attendances, function(item, innerCallback){
			// gets the roster spots
			Roster_Spot.findById(item.roster_spot_id, function(error, roster_spot) {
				// find the player model
				Player.findById(roster_spot.player_id, function(error2, player) {

					var object = {};
					object.first_name = player.first_name;
					object.last_name = player.last_name;
					object.attending = item.attending; 

					if(object.attending == true){
						attending.push(object);
					}else if(object.attending == false){
						skipping.push(object);
					}else{
						norespond.push(object);
					}


					innerCallback();
				});
			});
		}, function(err) {

			callback(err, attending, skipping, norespond);
		});
	});
};



// set the schema and export the model
mongoose.model('Attendance', AttendanceSchema);
module.exports = mongoose.model('Attendance', AttendanceSchema);
