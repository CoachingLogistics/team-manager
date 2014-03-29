/*
 * This is the roster_spot model, which connects teams and players
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
var	ObjectId = Schema.ObjectId;
var	Team = mongoose.model('Team');
var	Player = mongoose.model('Player');


var RosterSpotSchema = new Schema({
	team_id: {type: ObjectId, required: true},
	player_id: {type: ObjectId, required: true}
});



//what are the point of these?  Why not call Player.find() and Team.find()?
RosterSpotSchema.statics.getAllPlayers = function(callback){
	Player.find(function(err, players){
		callback(err, players);
	});
};

RosterSpotSchema.statics.getAllTeams = function(callback){
	Team.find(function(err, teams){
		callback(err, teams);
	});
};


//returns the player object for a roster_spot
RosterSpotSchema.method('getPlayer', function(callback) {
	Player.findOne({_id: this.player_id}, function(err, players){
		callback(err, players);
	});
});

//returns the team object for a roster_spot
RosterSpotSchema.method('getTeam', function(callback) {
	Team.findOne({_id: this.team_id}, function(err, teams){
		callback(err, teams);
	});
});



//returns roster_spots for a given team_id and player_id (hopefully 1 or none)
RosterSpotSchema.statics.getByIds = function(team_id, player_id, callback) {
	this.findOne({ $and: [ {team_id: team_id}, {player_id: player_id}]}, function(err, roster_spot){
		callback(err, roster_spot);

	});
};


//  returns an array of Roster_spot Objects for a player_id
RosterSpotSchema.statics.getByPlayerId = function(player_id, callback) {
	this.find({player_id: player_id}, function(err, rosters){
		callback(err, rosters);
	});
};

//  returns an array of Roster_spot Objects for a given team_id
RosterSpotSchema.statics.getByTeamId = function(team_id, callback) {
	this.find({team_id: team_id}, function(err, rosters){
		callback(err, rosters);
	});
};




//returns an array of TeamIds for a given player_id
RosterSpotSchema.statics.getTeamIdsForPlayer = function(player_id, callback) {
	this.getByPlayerId(player_id, function(err, rosters){
		var team_id_arr = [];
		rosters.forEach(function(rs){
			team_id_arr.push(rs.team_id);
		});
		callback(team_id_arr);
	});
};

//returns an array of Team objects for a given player_id
RosterSpotSchema.statics.getTeamsForPlayer = function(player_id, callback) {
	this.getTeamIdsForPlayer(player_id, function(ids){
		Team.find({ _id: { $in: ids } }, function(err, teams){
			callback(teams);
		});
	});
};





//returns array of player_ids for a given team_id
RosterSpotSchema.statics.getPlayerIdsForTeam = function(team_id, callback) {
	this.getByTeamId(team_id, function(err, rosters){
			var player_id_arr = [];
			rosters.forEach(function(rs){
				player_id_arr.push(rs.player_id);
			});
			callback(player_id_arr);
	});
};

//returns an array of Player objects for a given team_id
RosterSpotSchema.statics.getPlayersForTeam = function(team_id, callback) {
	this.getPlayerIdsForTeam(team_id, function(ids){
		Player.find({ _id: { $in: ids } }, function(err, players){
			callback(players);
		});
	});
};




mongoose.model('RosterSpot', RosterSpotSchema);
module.exports = mongoose.model('RosterSpot', RosterSpotSchema);