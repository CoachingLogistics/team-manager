

// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
})

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User');
var Player = mongoose.model('Player');


var FamilySchema = new Schema({
  user_id: {type: ObjectId, required: true},
  player_id: {type: ObjectId, required: true}
});


//  returns an array of Family Objects
FamilySchema.statics.getByPlayerId = function(player_id, callback) {
	this.find({player_id: player_id}, function(err, families){
		callback(err, families);
	});
};

//  returns an array of Family Objects
FamilySchema.statics.getByUserId = function(user_id, callback) {
	this.find({user_id: user_id}, function(err, families){
		callback(err, families);
	});
};


mongoose.model('Family', FamilySchema);
module.exports = mongoose.model('Family');