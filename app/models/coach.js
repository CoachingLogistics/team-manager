// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// mongoose requirements 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var async = require('async');

// schema
var CoachSchema = new Schema({
  user_id: {type: ObjectId, required: true},
  team_id: {type: ObjectId, required: true}
});


//  returns an array of Coach Objects with the specified team_id
CoachSchema.statics.getByTeamId = function(team_id, callback) {
	this.find({team_id: team_id}, function(err, coaches){
		callback(err, coaches);
	});
};

//  returns an array of Coach Objects with the specified user_id
CoachSchema.statics.getByUserId = function(user_id, callback) {
	this.find({user_id: user_id}, function(err, coaches){
		callback(err, coaches);
	});
};

// returns the users for a team
CoachSchema.statics.getUsersForTeam = function(team_id, callback) {
	var toReturn = new Array;
	this.find({'team_id': team_id}, function(err, coaches) {
		async.each(coaches, function(item, innerCallback){
			User.findById(item.user_id, function(error, returned) {
				toReturn.push(returned);
				innerCallback();
			});
		}, function(err) {
			callback(err, toReturn);
		});
	});
};

// returns the teams for a user
CoachSchema.statics.getTeamsForUser = function(user_id, callback) {
	var toReturn = new Array;
	this.find({'user_id': user_id}, function(err, coaches) {
		async.each(coaches, function(item, innerCallback) {
			Team.findById(item.team_id, function(error, returned) {
				toReturn.push(returned);
				innerCallback();
			});
		}, function(err) {
			callback(err, toReturn);
		});
	});
};

// set the schema and export the model
mongoose.model('Coach', CoachSchema);
module.exports = mongoose.model('Coach');