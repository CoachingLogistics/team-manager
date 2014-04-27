var mongoose = require('mongoose'),
	User = require('User'),
	Coach = require('Coach');

exports.is_coach = function(user_id, callback){
	Coach.getByUserId(user_id, function(err, coaches){
		if (coaches.length == 0){
			callback(err, false);
		}else{
			callback(err, true);
		}
	})
}