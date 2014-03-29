/*
 * This is the player model, which represents a player that belongs to a team (a kid)
 *
 */

//required
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//model
var PlayerSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  date_of_birth: Date,
  active: {type: Boolean, default: true}
});



// gets the name in "last, first" format
PlayerSchema.virtual('official_name').get(function() {
	return this.last_name + ', ' + this.first_name;
});

// gets the name in "first last" format
PlayerSchema.virtual('full_name').get(function() {
	return this.first_name + ' ' + this.last_name;
});

// age
PlayerSchema.virtual('age').get(function() {
	var day = this.date_of_birth.getDate();
	var month = this.date_of_birth.getMonth();
	var year = this.date_of_birth.getFullYear();
	var current = new Date();
	var age = current.getFullYear() - year;
	if((month > current.getMonth()) || (month == current.getMonth() && day > current.getDate())) {
		age = age -1;
	}
	return age;
});



//returns a player's user accounts (parents)
//tested in family_test
PlayerSchema.methods.getUsers = function (callback) {
	Family.getUsersForPlayer(this._id, function(users){
		callback(users);
	})
};



mongoose.model('Player', PlayerSchema);
module.exports.Player = mongoose.model('Player', PlayerSchema);
module.exports.Schema = PlayerSchema;
