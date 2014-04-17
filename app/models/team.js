/*
 * This is the team model
 *
 */


//required
 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

//model
 var TeamSchema = new Schema({
   name: {type: String, required: true},
   sport: {type: String, required: true},
   active: {type: Boolean, default: true}
 });


//don't think we can call other models, like Event or RosterSpot, from this file

//none of these work

// TeamSchema.methods.getPlayers = function (callback) {
// 	RosterSpot.getPlayersForTeam(this._id, function(players){
// 		callback(players);
// 	})
// };


// TeamSchema.methods.getEvents = function (callback) {
	//Event.getByTeam(this._id, function(events){
		//callback(events);
	//})
// };


// TeamSchema.methods.getUsers = function (callback) {
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
// };



 mongoose.model('Team', TeamSchema);
 module.exports = mongoose.model('Team');
