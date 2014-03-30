/*
 * This is the family model, which connects users and players
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
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User');
var Player = mongoose.model('Player');


//model
var FamilySchema = new Schema({
  user_id: {type: ObjectId, required: true},
  player_id: {type: ObjectId, required: true}
});



//  returns an array of Family Objects for a player
FamilySchema.statics.getByPlayerId = function(player_id, callback) {
	this.find({player_id: player_id}, function(err, families){
		callback(err, families);
	});
};

//  returns an array of Family Objects for a user
FamilySchema.statics.getByUserId = function(user_id, callback) {
	this.find({user_id: user_id}, function(err, families){
		callback(err, families);
	});
};




//returns an array of UserIds for a player
FamilySchema.statics.getUserIdsForPlayer = function(player_id, callback) {
	this.getByPlayerId(player_id, function(err, families){
		var user_id_arr = [];
		families.forEach(function(family){
			user_id_arr.push(family.user_id);
		});
		callback(user_id_arr);
	});
};

//returns an array of User objects for a player
FamilySchema.statics.getUsersForPlayer = function(player_id, callback) {
	//should this be in user? or player?
	this.getUserIdsForPlayer(player_id, function(ids){
		User.find({ _id: { $in: ids } }, function(err, users){
			callback(users);//yo
		});
	});
};




//returns array of player_ids for a user
FamilySchema.statics.getPlayerIdsForUser = function(user_id, callback) {
	this.getByUserId(user_id, function(err, families){
			var player_id_arr = [];
			families.forEach(function(family){
				player_id_arr.push(family.player_id);
			});
			callback(player_id_arr);
	});
};

//returns an array of Player objects for a user
FamilySchema.statics.getPlayersForUser = function(user_id, callback) {
	this.getPlayerIdsForUser(user_id, function(ids){
		Player.find({ _id: { $in: ids } }, function(err, players){
			callback(players);//yo
		});
	});
};




mongoose.model('Family', FamilySchema);
module.exports = mongoose.model('Family', FamilySchema);