
// // Synchronously load model dependecies, so foreign model calls can be made
// var fs = require('fs');
// var models_path = __dirname.replace('tests','app/models')

// fs.readdirSync(models_path).forEach(function (file) {
//   if (~file.indexOf('.js')) require(models_path + '/' + file);
// });


var should = require('should');

process.env.NODE_ENV = 'test';


var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);

var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var RosterSpot = mongoose.model('RosterSpot');



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
	    
	    //RosterSpot.remove(done);//clear out db

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

	    done();
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

		// describe('#getAllPlayers', function() {
		// 	it('should get all players currently in the database', function(done) {
		// 		RosterSpot.getAllPlayers(function(err, players){
		// 			players[0].should.have.property('first_name', player_object.first_name);
		// 			players[0].should.have.property('last_name', player_object.last_name);
		// 			players[0].should.have.property('date_of_birth', player_object.date_of_birth);
		// 			done();
		// 		});
		// 	});
		// });

		// describe('#getAllTeams', function() {
		// 	it('should get all teams currently in the database', function(done) {
		// 		RosterSpot.getAllTeams(function(err, teams){
		// 			teams[0].should.have.property('name', team_object.name);
		// 			teams[0].should.have.property('sport', team_object.sport);
		// 			done();
		// 		});
		// 	});
		// });

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
	});//save



	describe("testing the accessor methods", function() {
		var peter, steve, white, benedict, averages, cobras, jp, js, cw, jb, cb;

		beforeEach(function(done){

	        peter = new Player({
	        	first_name: "Peter",
	        	last_name: "Lafleur"
	    	});

	        benedict = new Player({
	        	first_name: "Benedict",
	        	last_name: "Arnold"
	    	});

	        steve = new Player({
	        	first_name: "Steve",
	        	last_name: "Pirate"
	    	});

	        white = new Player({
	        	first_name: "White",
	        	last_name: "Goodman"
	    	});

	        averages = new Team({
	        	name: "Average Joes",
	        	sport: "Dodgeball"
	        });

	       	cobras = new Team({
	        	name: "Purple Cobras",
	        	sport: "Dodgeball"
	        });

	        peter.save(function(err, pete){
	        	steve.save(function(err, stev){
	        		averages.save(function(err, joes){

	        			jp = new RosterSpot({
	        				team_id: joes._id,
	        				player_id: pete._id
	        			});

	        			jp.save(function(err, jp){
		        			js = new RosterSpot({
		        				team_id: joes._id,
		        				player_id: stev._id
		        			});

		        			js.save(function(err, js){
		        				white.save(function(err, whit){
		        					cobras.save(function(err, purps){
		        						cw = new RosterSpot({
					        				team_id: purps._id,
					        				player_id: whit._id
					        			});

					        			cw.save(function(err, cw){
					        				benedict.save(function(err, ben){
				        						cb = new RosterSpot({
							        				team_id: purps._id,
							        				player_id: ben._id
							        			});

							        			cb.save(function(err, cb){
							        				jb = new RosterSpot({
								        				team_id: joes._id,
								        				player_id: ben._id
								        			});

								        			jb.save(function(err, jb){
								        				done();
								        			})
							        			})			        					
					        				})
					        			});
		        					});
		        				})
		        			});
	        			});
	        		});
	        	});
	        });
	    });//beforeEach

		


        it('method getByPlayerId', function(done){

            RosterSpot.getByPlayerId(peter._id, function(err, spots){
                spots[0].should.have.property('player_id', peter._id);

                RosterSpot.getByPlayerId(white._id, function(err, spots){
                    spots[0].should.have.property('player_id', white._id);

                    RosterSpot.getByPlayerId(benedict._id, function(err, spots){
                        spots.should.have.length(2);
                        spots[0].should.have.property('player_id', benedict._id);
                        
                        done();
                    });
                });                    
            });
        });


            it('method getByTeamId', function(done){

                RosterSpot.getByTeamId(cobras._id, function(err, spots){
                    spots.should.have.length(2);
                    spots[0].should.have.property('team_id', cobras._id);
                    spots[1].should.have.property('team_id', cobras._id);

                    RosterSpot.getByTeamId(averages._id, function(err, spots){
                        spots.should.have.length(3);
                        spots[0].should.have.property('team_id', averages._id);
                        spots[1].should.have.property('team_id', averages._id);
                        spots[2].should.have.property('team_id', averages._id);

                        done();

                    });
                });
            });


            it('method getByIds', function(done){

                RosterSpot.getByTeamId(cobras._id, function(err, spots){
                    spots.should.have.length(2);
                    spots[0].should.have.property('team_id', cobras._id);
                    spots[1].should.have.property('team_id', cobras._id);

                    RosterSpot.getByTeamId(averages._id, function(err, spots){
                        spots.should.have.length(3);
                        spots[0].should.have.property('team_id', averages._id);
                        spots[1].should.have.property('team_id', averages._id);
                        spots[2].should.have.property('team_id', averages._id);

                        done();

                    });
                });
            });
                


                describe('grabbing objects', function(){

                    it('method getTeamsForPlayer', function(done){

                        RosterSpot.getTeamsForPlayer(peter._id, function(teams){
                            teams.should.have.length(1);
                            teams[0].should.have.property('name', 'Average Joes');

                            RosterSpot.getTeamsForPlayer(white._id, function(teams){
                                teams.should.have.length(1);
                                teams[0].should.have.property('name', 'Purple Cobras');

                                RosterSpot.getTeamsForPlayer(benedict._id, function(teams){
                                    teams.should.have.length(2);
                                    teams[0].should.have.property('sport', 'Dodgeball');
                                    teams[1].should.have.property('sport', 'Dodgeball');
                                    
                                    done();
                                });
                            }); 
                        });
                    });

                   it('method getPlayersForTeam', function(done){

                        RosterSpot.getPlayersForTeam(averages._id, function(players){
                            players.should.have.length(3);

                            RosterSpot.getPlayersForTeam(cobras._id, function(players){
                                players.should.have.length(2);
                                    
                                done();
                            }); 
                        });
                    });

                    it('method getByIds', function(done){

                        RosterSpot.getByIds(averages._id, steve._id, function(err, spot){
                        	
                            spot.should.have.property('_id', js._id)

                            RosterSpot.getByIds(cobras._id, white._id, function(err, spot){
                            	
                                spot.should.have.property('_id', cw._id)
                                    
                                done();
                            }); 
                        });
                    });


                   //Tests for the self.methods in Teams and Players.

                   // it('Team instance method getPlayers', function(done){

	                  //  	cobras.getPlayers(function(players){
	                  //  		players.should.have.length(2);

	                  //  		averages.getPlayers(function(players){
	                  //  			players.should.have.length(3);

	                  //  			done();
	                  //  		});
	                  //  	});
                   // });

                   // it('Player instance method getTeams', function(done){

	                  //  	peter.getTeams(function(teams){
	                  //  		teams.should.have.length(1);
	                  //  		teams.should.have.property('name', 'Average Joes')

	                  //  		white.getTeams(function(teams){
	                  //  			teams.should.have.length(1);
	                  //  			teams.should.have.property('name', 'Purple Cobras')

	                  //  			benedict.getTeams(function(teams){
	                  //  				teams.should.have.length(2);

	                  //  				done();
	                  //  			});
	                  //  		});
	                  //  	});
                   // });


               });//describe




	});


});







