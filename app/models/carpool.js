/*
 * This is the carpool model, which connects users to events and riders.
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
var User = mongoose.model('User');
var	ObjectId = Schema.ObjectId;
var	Player = mongoose.model('Player');
var	Team = mongoose.model('Team');
var	Event = mongoose.model('Event');
var	RosterSpot = mongoose.model('RosterSpot');

var gmaps = require('googlemaps');
gmaps.config('key', 'AIzaSyA645rwcj_NE3CJnO83xX2CQ9ef7n4XWwI');



var CarpoolSchema = new Schema({
	user_id: {type: ObjectId, required: true},
	event_id: {type: ObjectId, required: true},
	location: {type: String},
	notes: {type: String},
	time: {type: Date},
	size: {type: Number, required: true},
  latitude: {type:Number, default:null }, //needs testing
  longitude: {type:Number, default:null } //needs testing
});



//returns the user object for a carpool
CarpoolSchema.methods.getUser =  function(callback) {
	User.findById(this.user_id, function(err, user){
		callback(err, user);
	});
};

//returns the event object for a carpool
CarpoolSchema.methods.getEvent =  function(callback) {
	Event.findById(this.event_id, function(err, event){
		callback(err, event);
	});
};


//get time formatted string
CarpoolSchema.methods.getTime =  function(callback) {
	var date = this.time;
	var time = "AM";
  	var hour = date.getHours();
  	if( date.getHours()>=12){
   		hour =  date.getHours()-12;
    	time="PM";
  	}
  	var minutes = date.getMinutes();
  	if(date.getMinutes() == 0){
    	minutes = "00";
  	}

  	return hour+":"+minutes+" "+time;
};



//returns carpools for a given event_id and user_id (hopefully 1 or none)
CarpoolSchema.statics.getByIds = function(user_id, event_id, callback) {
	this.findOne({ $and: [ {event_id: event_id}, {user_id: user_id}]}, function(err, carpool){
		callback(err, carpool);

	});
};


//  returns an array of carpool Objects for a user_id
CarpoolSchema.statics.getByUserId = function(user_id, callback) {
	this.find({user_id: user_id}, function(err, rosters){
		callback(err, rosters);
	});
};

//  returns an array of carpool Objects for a given event_id
CarpoolSchema.statics.getByEventId = function(event_id, callback) {
	this.find({event_id: event_id}, function(err, rosters){
		callback(err, rosters);
	});
};


//needs testing

//calculates the carpool location's longitude and latitude whenever the location is modified
CarpoolSchema.pre('save', function(next){
  var carpool = this;
  if(!carpool.isModified('location')) return next();

  gmaps.geocode(carpool.location, function(err, returned){
    console.log(returned.status);
    if(returned){
      if(returned.status == 'OK'){

        var coords=returned.results[0].geometry.location;//is an object in format {"lat":####, "lng":####}

        carpool.latitude = coords.lat;
        carpool.longitude = coords.lng;
        next();
      }else{
        next();
      }

    }else{
      alert("Geocode was not successful, try again later");
      next();//lat and lon are both NULL
    }
  }, 'false');//this is a param that states if the request involves a geolocation device
});

//for team?

mongoose.model('Carpool', CarpoolSchema);
module.exports = mongoose.model('Carpool', CarpoolSchema);

var Carpool = mongoose.model('Carpool');

// the schema for the Rider
var RiderSchema = new Schema({
  roster_spot_id: {type: ObjectId, ref: 'RosterSpot', required: true},
  carpool_id: {type: ObjectId, ref: 'Carpool'},
  event_id: {type: ObjectId, ref: 'Event', required: true},
  location: String,
  time: Date,
  confirmed: {type: Boolean, default: false},
  latitude: {type:Number, default:null }, //needs testing
  longitude: {type:Number, default:null } //needs testing
});

// gets the carpool for a ride
RiderSchema.methods.getCarpool = function(callback) {
  Carpool.findById(this.carpool_id, function(err, theCarpool) {
    return callback(err, theCarpool);
  });
}

// gets the roster spot for the ride
RiderSchema.methods.getRosterSpot = function(callback) {
  RosterSpot.findById(this.roster_spot_id, function(err, theRosterSpot) {
    return callback(err, theRosterSpot);
  });
}

// gets the player who is the rider
RiderSchema.methods.getRider = function(callback) {
  // find the roster spot
  RosterSpot.findById(this.roster_spot_id, function(err, theRosterSpot) {
    // if there is an error return it here
    if(err) {
      return callback(err);
    }
    // if there is a roster spot, find the player and return it
    Player.findById(theRosterSpot.player_id, function(err2, thePlayer) {
      return callback(err2, thePlayer);
    });
  });
}

// finds all of the riders based on a roster spot id
RiderSchema.statics.getByRosterSpotId = function(roster_spot_id, callback) {
  this.find({'roster_spot_id': roster_spot_id}, function(err, docs) {
    return callback(err, docs);
  });
}

// finds all of the riders for a carpool
RiderSchema.statics.getByCarpoolId = function(carpool_id, callback) {
  this.find({'carpool_id': carpool_id}, function(err, docs) {
    return callback(err, docs);
  });
}

// finds the rider given a carpool id and a roster_spot id
RiderSchema.statics.getByIds = function(carpool_id, roster_spot_id, callback) {
  this.findOne({ $and: [ {carpool_id: carpool_id}, {roster_spot_id: roster_spot_id}]}, function(err, rider){
    callback(err, rider);
  });
};


var Carpool = mongoose.model('Carpool');

//needs testing
//calculates the rider location's longitude and latitude whenever the location is modified
RiderSchema.pre('save', function(next){
  var rider = this;
  if(!rider.isModified('location')) return next();

  gmaps.geocode(rider.location, function(err, returned){
    console.log(returned.status);
    if(returned){
      if(returned.status == 'OK'){

        var coords=returned.results[0].geometry.location;//is an object in format {"lat":####, "lng":####}

        rider.latitude = coords.lat;
        rider.longitude = coords.lng;
        next();
      }else{
        next();
      }

    }else{
      alert("Geocode was not successful, try again later");
      next();//lat and lon are both NULL
    }
  }, 'false');//this is a param that states if the request involves a geolocation device
});

// gets the carpool for a ride
RiderSchema.methods.getCarpool = function(callback) {
  Carpool.findById(this.carpool_id, function(err, theCarpool) {
    return callback(err, theCarpool);
  });
}

// gets the roster spot for the ride
RiderSchema.methods.getRosterSpot = function(callback) {
  RosterSpot.findById(this.roster_spot_id, function(err, theRosterSpot) {
    return callback(err, theRosterSpot);
  });
}

// gets the event of the rider
RiderSchema.methods.getEvent = function(callback) {
  Event.findById(this.event_id, function(err, theEvent) {
    callback(err, theEvent);
  });
}

// gets the player who is the rider
RiderSchema.methods.getRider = function(callback) {
  // find the roster spot
  RosterSpot.findById(this.roster_spot_id, function(err, theRosterSpot) {
    // if there is an error return it here
    if(err) {
      return callback(err);
    }
    // if there is a roster spot, find the player and return it
    Player.findById(theRosterSpot.player_id, function(err2, thePlayer) {
      return callback(err2, thePlayer);
    });
  });
}

// finds all of the riders based on a roster spot id
RiderSchema.statics.getByRosterSpotId = function(roster_spot_id, callback) {
  this.find({'roster_spot_id': roster_spot_id}, function(err, docs) {
    return callback(err, docs);
  });
}

// finds all of the riders for a carpool
RiderSchema.statics.getByCarpoolId = function(carpool_id, callback) {
  this.find({'carpool_id': carpool_id}, function(err, docs) {
    return callback(err, docs);
  });
}

// finds riders by an event id, to get riders for an event
RiderSchema.statics.getByEventId = function(event_id, callback) {
  this.find({event_id: event_id}, function(err, docs) {
    callback(err, docs);
  });
}


// gets a list of riders who still need a ride to an event
RiderSchema.statics.needRideForEvent = function(event_id, callback) {
  this.find({event_id: event_id, carpool_id: null}, function(err, docs) {
    callback(err, docs);
  });
}

// finds the rider given a carpool id and a roster_spot id
RiderSchema.statics.getByIds = function(carpool_id, roster_spot_id, callback) {
  this.findOne({ $and: [ {carpool_id: carpool_id}, {roster_spot_id: roster_spot_id}]}, function(err, rider){
    callback(err, rider);
  });
};


mongoose.model('Rider', RiderSchema);
module.exports.Rider = mongoose.model('Rider', RiderSchema);
