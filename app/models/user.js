/*
 * This is the user model, which gives users access with email and password functionality
 *
 */


//required
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//used to hash passwords
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 7;

//model
var UserSchema = new Schema({
  email: { type:String, unique:true, required:true, match: /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/ },//regex for email type
  first_name: { type:String, default:"Mr./Ms." },
  last_name: { type:String, default: "User" },
  phone : { type:String },
  password : { type:String },
  accessToken: { type: String }, // Used for Remember Me sessions
  active: { type: Boolean, default: false }
});


//returns name in "first last" format
UserSchema.virtual('name').get(function() {
	return this.first_name + ' ' + this.last_name;
});

//returns a user for a given email address
UserSchema.statics.getByEmail = function(email, callback) {
	this.findOne({email: email}, function(err, user){
		callback(err, user);
	});
};



//returns the players that a user is connect to via family
//tested in family_test
UserSchema.methods.getPlayers = function(callback) {
	Family.getPlayersForUser(this._id, function(players){
		callback(players);
	})
};



//bcrypt middleware, hahes the password before it is saved
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();


	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			user.active = true; //put this in so we know if a person logged in
			next();
		});
	});
});


//password verification, compares a given string to the user's (unhashed) password, returns true if it matches
UserSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};


//remember me implementation helper method
//creates a random session cookie (this is handled by express session I think)
UserSchema.methods.generateRandomToken = function() {
	var user = this;
	var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var token = new Date().getTime() + '_';
	for( var x = 0; x<16; x++){
		var i = Math.floor(Math.random() * 62 );
		token += chars.charAt(i);
	}
	return token;
};

//this method returns a random, 8-character long password with lower & upper case letters and numbers 
UserSchema.statics.generateRandomPassword = function() {

	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var token = "";
	for( var x = 0; x<8; x++){
		var i = Math.floor(Math.random() * chars.length );
		token += chars.charAt(i);
	}
	return token;
};





mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');