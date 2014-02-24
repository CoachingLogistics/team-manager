var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 7;

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: { type:String, unique:true, required:true, match: /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/ },
  first_name: { type:String, required:true },
  last_name: { type:String, required:true },
  phone : { type:String, required:true },
  password : { type:String, required:true },
  accessToken: { type: String } // Used for Remember Me sessions
});


//bcrypt middleware
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

//password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

//remember me implementation helper method
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

mongoose.model('User', UserSchema);