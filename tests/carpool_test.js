
var should = require('should');

process.env.NODE_ENV = 'test';

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);


//var user_model = require('../app/models/user');
var mongoose = require('mongoose');
// var test_db = mongoose.connect('mongodb://localhost/team-manager-test'); //connection to the testing environment DB

var  User = mongoose.model('User');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var Event = mongoose.model('Event');
var RosterSpot = mongoose.model('RosterSpot');
var Carpool = mongoose.model('Carpool');



//mocha stuff
after(function(done){
	console.log("carpool tests done");
	done();
});


//starting the testing

describe('Carpool', function(){	//context, so we can see where tests happen in console

  //establishing all the objects we'll ever need
  var cobras = new Team({
      name: 'Purple Cobras',
      sport: 'Dodgeball'
  });

  var eric = new User({
    first_name    : 'Eric',
    last_name    : 'Cartman',
    email    : 'eric@example.com',
    password: "secret", 
    phone: "8889882688"
  });

  var stan = new User({
    first_name    : 'Stan',
    last_name    : 'Marsh',
    email    : 'stan@example.com',
    password: "password", 
    phone: "8888675309"
  });

  var kenny = new User({
    first_name    : 'Kenny',
    last_name    : 'Rogers',
    email    : 'ken@example.com',
    password: "omg", 
    phone: "8888644444"
  });

  var event1 = new Event({
      // team_id
      date : new Date(2014, 2, 24, 16, 20),
      location : 'Wiegand gym',
      type : 'practice'
  });

  var event2 = new Event({
      // team_id
      date : new Date(2014, 10, 15, 12, 30),
      location : 'Skibo Gym',
      type : 'Game'
  });

  var carp_e_1({
    //user: eric
    //event: event1
    location: "500 Forbes Avenue",
    time: new Date(2014, 2, 24, 16, 20),
    size: 3
  })



  beforeEach(function(done){  //clears the database and creates testing objects
        
        User.remove(function(){
          Event.remove(function(){
            Team.remove(function(){
              Carpool.remove(function(){
                
              });
            });
          });
        });

        testCarpool = {
          first_name    : 'Ned',
          last_name    : 'Flanders',
          email    : 'flanders@gmail.com',
          password: "secret", 
          phone: "8089882688"
        };


    });

    after(function(done){

        User.remove();
        Event.remove();//clear out db
        Team.remove();
        Carpool.remove(done);
    });



    describe('context set up', function(){

      beforeEach(function(done){


      })

    })




});