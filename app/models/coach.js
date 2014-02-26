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
