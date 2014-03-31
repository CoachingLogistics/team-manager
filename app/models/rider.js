/*
 * Rider model to connect a roster spot to a carpool
 */


// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) {
     require(models_path + '/' + file);
   }
});

 // necessary packages, models, etc
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var ObjectId = Schema.ObjectId;
 var RosterSpot = mongoose.model('RosterSpot');
 var Player = mongoose.model('Player');
 var Carpool = mongoose.model('Carpool');

// the schema for the Rider
var RiderSchema = new Schema({
  roster_spot_id: {type: ObjectId, required: true},
  carpool_id: ObjectId,
  location: String,
  time: Date,
  confirmed: {type: Boolean, default: false}
});

// gets the carpool for a ride
RiderSchema.methods.getCarpool = function(callback) {
  Carpool.findById(this.carpool_id, function(err, the_carpool) {
    return callback(err, theCarpool);
  });
}

// gets the roster spot for the ride
RiderSchema.methods.getRosterSpot = function(callback) {
  RoserSpot.findById(this.roster_spot_id, function(err, theRosterSpot) {
    return callback(err, theRosterSpot);
  });
}

// gets the player who is the rider
RiderSchema.methods.getRider = function(callback) {
  // find the roster spot
  RosterSpot.findById(this.roser_spot_id, function(err, theRosterSpot) {
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
  this.find({'carpool_id': carpool_id, 'roster_spot_id': roster_spot_id}, function(err, docs) {
    return callback(err, docs[0]);
  });
}

mongoose.model('Rider', RiderSchema);
module.exports = mongoose.model('Rider', RiderSchema);
