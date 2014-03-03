// // Example model

var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
})

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Player = mongoose.model('Player'),
	Team = mongoose.model('Team');

var RosterSpotSchema = new Schema({
	team_id: {type: ObjectId, required: true},
	player_id: {type: ObjectId, required: true}
});

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

RosterSpotSchema.method('getPlayer', function(callback) {
	Player.findOne({_id: this.player_id}, function(err, players){
		callback(err, players);
	});
});

RosterSpotSchema.method('getTeam', function(callback) {
	Team.findOne({_id: this.team_id}, function(err, teams){
		callback(err, teams);
	});
});

mongoose.model('RosterSpot', RosterSpotSchema);
