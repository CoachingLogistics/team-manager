

var should = require('should');

process.env.NODE_ENV = 'test';

var roster_spot_model = require('../app/models/roster_spot');
var mongoose = require('mongoose');
//var test_db = mongoose.connect('mongodb://localhost/test-test'); //connection to the testing environment DB

var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var RosterSpot = mongoose.model('RosterSpot');

var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);


//mocha stuff
after(function(done){
  // test_db.connection.db.dropDatabase(function(){
  //   test_db.connection.close(function(){
  //     done();
  //   });
  // });
		console.log("\nroster spot testing finished");
		done();
});


//starting the testing

describe('RosterSpot', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
	    
	    RosterSpot.remove(done);//clear out db

	    testPlayer = {
	    	first_name: "Johnny",
	    	last_name: "Joestar",
	    	date_of_birth: "6/24/1993"
	    }
	    testTeam = {
	    	name: "test",
	    	sport: "soccer"
	    }
	    testRosterSpot = {
	      player_id: null,
	      team_id: null
	    };
    });

    after(function(done){
	    //clear out db
	    RosterSpot.remove();
	    Team.remove();
	    Player.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
        var player_object;
        var team_object;
        var roster_spot_object;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
	        player_object = new Player(testPlayer);
	        player_object.save(function(err, player){
	        	team_object = new Team(testTeam);
	        	team_object.save(function(err, team){
	        		roster_spot_object = new RosterSpot(testRosterSpot);
	        		roster_spot_object.player_id = player._id;
	        		roster_spot_object.team_id = team._id;
	        		roster_spot_object.save(done);
	        	})
	        });	//if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('test1: should have required properties', function(done){
	          roster_spot_object.should.have.property('player_id', player_object._id);
	          roster_spot_object.should.have.property('team_id', team_object._id);
	          done();
        });
        // shouldn't work if the player_id is blank
        it('test2: should not allow a roster_spot to be created without a player_id', function(done){
        	var rosterNoPlayer = new RosterSpot(testRosterSpot);
        	rosterNoPlayer.player_id = null;
        	rosterNoPlayer.save(function(err, returned){
        		// this should result in an error
        		should.exist(err);
        		done();
        	});
        });

        // shouldn't work if the team_id is blank
        it('test3: should not allow a roster_spot to be created without a team_id', function(done){
        	var rosterNoTeam = new RosterSpot(testRosterSpot);
        	rosterNoTeam.team_id = null;
        	rosterNoTeam.save(function(err, returned){
        		// this should result in an error
        		should.exist(err);
        		done();
        	});
        });

		describe('#getAllPlayers', function() {
			it('should get all players currently in the database', function(done) {
				RosterSpot.getAllPlayers(function(err, players){
					players[0].should.have.property('first_name', player_object.first_name);
					players[0].should.have.property('last_name', player_object.last_name);
					players[0].should.have.property('date_of_birth', player_object.date_of_birth);
					done();
				});
			});
		});

		describe('#getAllTeams', function() {
			it('should get all teams currently in the database', function(done) {
				RosterSpot.getAllTeams(function(err, teams){
					teams[0].should.have.property('name', team_object.name);
					teams[0].should.have.property('sport', team_object.sport);
					done();
				});
			});
		});

		describe('#getPlayer', function() {
			it('should be able to get the player associated with the roster spot', function(done) {
				roster_spot_object.getPlayer(function(err, player) {
					should.not.exist(err);
					should(player.first_name).equal(player_object.first_name);
					should(player.last_name).equal(player_object.last_name);
					should(player.date_of_birth).eql(player_object.date_of_birth);
					done();
				});
			});
		});

		describe('#getTeam', function() {
			it('should be able to get the player associated with the roster spot', function(done) {
				roster_spot_object.getTeam(function(err, team) {
					should.not.exist(err);
					should(team.name).equal(team_object.name);
					should(team.sport).equal(team_object.sport);
					done();
				});
			});
		});

		// routing and controller testing
		describe('routes', function() {

		});
	});
});