process.env.NODE_ENV = 'test';
// required modules/packages
var should = require('should');
var app = require("../app");
// may not need these just yet
var request = require("supertest");
var agent = request.agent(app);
var mongoose = require('mongoose');
// Schemas
var  Player = mongoose.model('Player');
var  Team = mongoose.model('Team');
var  Event = mongoose.model('Event');
var Roster_Spot = mongoose.model('RosterSpot');
var Attendance = mongoose.model('Attendance');

// finishing up tests
after(function(done){
  console.log("\ncoach tests done");
  done();
});

describe('Attendance', function() {
  
}); // end describe Attendance
