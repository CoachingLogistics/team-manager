// Synchronously load model dependecies, so foreign model calls can be made
// var fs = require('fs');
// var models_path = __dirname;
// fs.readdirSync(models_path).forEach(function (file) {
//   if (~file.indexOf('.js')) require(models_path + '/' + file);
// })


 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

// var RosterSpot = require('./roster_spot');
// var RosterSpot = mongoose.model('RosterSpot');
   
// console.log(RosterSpot);

 var TeamSchema = new Schema({
   name: {type: String, required: true},
   sport: {type: String, required: true},
   active: {type: Boolean, default: true}
 });




//doesn't work
// TeamSchema.methods.getPlayers = function (callback) {
// 	RosterSpot.getPlayersForTeam(this._id, function(players){
// 		callback(players);
// 	})
// };


//test this
TeamSchema.methods.getEvents = function (callback) {
	//Event.getByTeam(this._id, function(events){
		//callback(events);
	//})
};


//test this
TeamSchema.methods.getUsers = function (callback) {
	// var user_array = [];
	// this.getPlayers(function(players){
	// 	//get the user for each player...
	// 	//async?
	// 	for(var ii = 0; ii< players.length; ii++){
	// 		players[ii].getUsers(function(users){

	// 			//users may have mutliple objects (two parents)
	// 			for(var pp=0; pp< users.length; pp++){
	// 				user_array.push(users[pp]);
	// 			}
				
	// 		})
	// 	}//async this?

	// });
};



 mongoose.model('Team', TeamSchema);
 module.exports = mongoose.model('Team');
