

	var mongoose = require('mongoose');
  	var Schema = mongoose.Schema;





//cannot use dependent models in this?????
// var Family = mongoose.model('Family');
// var RosterSpot = require('./roster_spot.js').RosterSpot;
//console.log(RosterSpot);


var PlayerSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  date_of_birth: Date
});


// gets the name in last, first format
PlayerSchema.virtual('official_name').get(function() {
	return this.last_name + ', ' + this.first_name;
});

// gets the name in first last format
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


//tested in family_test
PlayerSchema.methods.getUsers = function (callback) {
	Family.getUsersForPlayer(this._id, function(users){
		callback(users);
	})
};

//doesn't work
PlayerSchema.methods.getTeams = function (callback) {
	RosterSpot.getTeamsForPlayer(this._id, function(teams){
		callback(teams);
	})
};

// // test this
// PlayerSchema.methods.getAttendance = function (callback) {
// 
// };



mongoose.model('Player', PlayerSchema);
module.exports.Player = mongoose.model('Player', PlayerSchema);
module.exports.Schema = PlayerSchema;
