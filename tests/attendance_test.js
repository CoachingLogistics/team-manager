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
  console.log("\nattendance tests done");
  done();
});

describe('Attendance', function() {
  // one team
  var theTeam;
  // two events
  var game;
  var prac;
  // three players
  var matt;
  var mark;
  var luke;
  // three roster spots
  var mattSpot;
  var markSpot;
  var lukeSpot;

  // create these before each test
  beforeEach(function(done) {
    // create everything.. callbacks on callbacks
    theTeam = new Team({'name': 'Flyers', 'sport': 'Hockey', 'active': true});
    theTeam.save(function(err, savedTeam) {
      game = new Event({'team_id': savedTeam._id, 'date': new Date('4/10/2014'), 'location': 'WFC', 'type': 'Game'});
      game.save(function(err, game_saved) {
        prac = new Event({'team_id': savedTeam._id, 'date': new Date('4/11/2014'), 'location': 'FSZ', 'type': 'Practice'});
        prac.save(function(err, prac_saved) {
          // DOB not required, so not going to waste time here
          matt = new Player({'first_name': 'Matt', 'last_name': 'Smith', 'active': true});
          matt.save(function(err, matt_saved) {
            mark = new Player({'first_name': 'Mark', 'last_name': 'Johnson', 'active': true});
            mark.save(function(err, mark_saved) {
              luke = new Player({'first_name': 'Luke', 'last_name': 'Mazurik', 'active': true});
              luke.save(function(err, luke_saved) {
                mattSpot = new Roster_Spot({'team_id': savedTeam._id, 'player_id': matt_saved._id});
                mattSpot.save(function(err, mattSpot_saved) {
                  markSpot = new Roster_Spot({'team_id': savedTeam._id, 'player_id': mark_saved._id});
                  markSpot.save(function(err, markSpot_saved) {
                    lukeSpot = new Roster_Spot({'team_id': savedTeam._id, 'player_id': luke_saved._id});
                    lukeSpot.save(function(err, lukeSpot_saved) {
                      // now we have context for our tests
                      done();
                    }); // lukeSpot save
                  }); // markSpot save
                }); // mattSpot save
              }); // luke save
            }); // mark save
          }); // matt save
        }); // prac save
      }); // game save
    }); // theTeam save
  });// ends before each

  // remove everything after the tests
  after(function(done) {
    // remove all of the models
    Team.remove();
    Event.remove();
    Player.remove();
    Roster_Spot.remove();
    Attendance.remove();
    done();
  });

  describe('#save()', function(done) {
    // should work
    it('should allow an attendance to be saved with an event_id, roster spot id, and attendance response', function(done) {
      var mattAttendance = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattAttendance.save(function(err, mattAttendance_saved) {
        should.not.exist(err);
        mattAttendance_saved.should.have.property('event_id', game._id);
        mattAttendance_saved.should.have.property('roster_spot_id', mattSpot._id);
        mattAttendance_saved.should.have.property('attending', true);
        done();
      });
    });

    // should allow for responses being false
    it('should allow an attendance to be created with a response of false', function(done) {
      var markAttendance = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': false});
      markAttendance.save(function(err, markAttendance_saved) {
        should.not.exist(err);
        markAttendance_saved.should.have.property('event_id', game._id);
        markAttendance_saved.should.have.property('roster_spot_id', markSpot._id);
        markAttendance.should.have.property('attending', false);
        done();
      });
    });

    // tests validations
    // no event id
    it('should not allow an attendance to be saved if it does not have an event_id', function(done) {
      var mattAttendance = new Attendance({'roster_spot_id': mattSpot._id, 'attending': true});
      mattAttendance.save(function(err, mattAttendance_saved) {
        should.exist(err);
        done();
      });
    });

    // no roster spot id
    it('should not allow an attendance to be saved if it does not have a roster_spot_id', function(done) {
      var blankAttendnace = new Attendance({'event_id': game._id, 'attending': true});
      blankAttendnace.save(function(err, blankAttendance_saved) {
        should.exist(err);
        done();
      });
    });

    // no response
    it('should allow an attendance to be created if it does not have a response', function(done) {
      var mattAttendance = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id});
      mattAttendance.save(function(err, mattAttendance_saved) {
        should.not.exist(err);
        mattAttendance_saved.should.have.property('event_id', game._id);
        mattAttendance_saved.should.have.property('roster_spot_id', mattSpot._id);
        mattAttendance_saved.should.have.property("attending", null);
        done();
      });
    });
  }); // end describe save

  describe('#getByEventId()', function(done) {
    // these are the attendances we will be using for this
    var mattGame;
    var markGame;
    var mattPrac;
    var lukePrac;

    beforeEach(function(done) {
      mattGame = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattGame.save(function(err, mattGame_saved) {
        markGame = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': true});
        markGame.save(function(err, markGame_saved) {
          mattPrac = new Attendance({'event_id': prac._id, 'roster_spot_id': mattSpot._id, 'attending': false});
          mattPrac.save(function(err, mattPrac_saved) {
            lukePrac = new Attendance({'event_id': prac._id, 'roster_spot_id': lukeSpot._id, 'attending': true});
            lukePrac.save(function(err, lukePrac_saved) {
              // now we can test
              done();
            });// lukePrac save
          }); // mattPrac save
        }); // markGame save
      }); // mattGame save
    }); // before each

    // should work for Game
    it('should have a function to get all of the attendances for an event (testing game)', function(done) {
      Attendance.getByEventId(game._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        docs[0].should.have.property('event_id', game._id);
        docs[1].should.have.property('event_id', game._id);
        done();
      });
    });

    // should work for Practice
    it('should have a function to get all of the attendances for an event (testing practice)', function(done) {
      Attendance.getByEventId(prac._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        docs[0].should.have.property('event_id', prac._id);
        docs[1].should.have.property('event_id', prac._id);
        done();
      });
    });
  }); // describe getByEventId

  describe('#getByRosterId()', function(done) {
    // these are the attendances we will be using for this
    var mattGame;
    var markGame;
    var mattPrac;
    var lukePrac;

    beforeEach(function(done) {
      mattGame = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattGame.save(function(err, mattGame_saved) {
        markGame = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': true});
        markGame.save(function(err, markGame_saved) {
          mattPrac = new Attendance({'event_id': prac._id, 'roster_spot_id': mattSpot._id, 'attending': false});
          mattPrac.save(function(err, mattPrac_saved) {
            lukePrac = new Attendance({'event_id': prac._id, 'roster_spot_id': lukeSpot._id, 'attending': true});
            lukePrac.save(function(err, lukePrac_saved) {
              // now we can test
              done();
            });// lukePrac save
          }); // mattPrac save
        }); // markGame save
      }); // mattGame save
    }); // before each

    // should work for Game
    it('should have a function to get all of the attendances for a roster spot (testing matt)', function(done) {
      Attendance.getByRosterId(mattSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        docs[0].should.have.property('roster_spot_id', mattSpot._id);
        docs[1].should.have.property('roster_spot_id', mattSpot._id);
        done();
      });
    });

    // should work for Practice
    it('should have a function to get all of the attendances for an event (testing luke)', function(done) {
      Attendance.getByRosterId(lukeSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(1);
        docs[0].should.have.property('roster_spot_id', lukeSpot._id);
        docs[0].should.have.property('event_id', prac._id);
        docs[0].should.have.property('attending', true);
        done();
      });
    });
  }); // describe getByRosterId

  describe('#getByIds()', function(done) {
    // these are the attendances we will be using for this
    var mattGame;
    var markGame;
    var mattPrac;
    var lukePrac;

    beforeEach(function(done) {
      mattGame = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattGame.save(function(err, mattGame_saved) {
        markGame = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': true});
        markGame.save(function(err, markGame_saved) {
          mattPrac = new Attendance({'event_id': prac._id, 'roster_spot_id': mattSpot._id, 'attending': false});
          mattPrac.save(function(err, mattPrac_saved) {
            lukePrac = new Attendance({'event_id': prac._id, 'roster_spot_id': lukeSpot._id, 'attending': true});
            lukePrac.save(function(err, lukePrac_saved) {
              // now we can test
              done();
            });// lukePrac save
          }); // mattPrac save
        }); // markGame save
      }); // mattGame save
    }); // before each

    // should work for Game
    it('should have a function to get all of the attendances for a given event and roster spot (testing matt)', function(done) {
      Attendance.getByIds(game._id, mattSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(1);
        docs[0].should.have.property('roster_spot_id', mattSpot._id);
        docs[0].should.have.property('event_id', game._id);
        done();
      });
    });

    // should work for Practice
    it('should have a function to get all of the attendances for a given event and roster spot (testing luke)', function(done) {
      Attendance.getByIds(prac._id, lukeSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(1);
        docs[0].should.have.property('roster_spot_id', lukeSpot._id);
        docs[0].should.have.property('event_id', prac._id);
        docs[0].should.have.property('attending', true);
        done();
      });
    });
  }); // describe getByIds

  describe('#getPlayersForEvent()', function(done) {
    // these are the attendances we will be using for this
    var mattGame;
    var markGame;
    var mattPrac;
    var lukePrac;

    beforeEach(function(done) {
      mattGame = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattGame.save(function(err, mattGame_saved) {
        markGame = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': true});
        markGame.save(function(err, markGame_saved) {
          mattPrac = new Attendance({'event_id': prac._id, 'roster_spot_id': mattSpot._id, 'attending': false});
          mattPrac.save(function(err, mattPrac_saved) {
            lukePrac = new Attendance({'event_id': prac._id, 'roster_spot_id': lukeSpot._id, 'attending': true});
            lukePrac.save(function(err, lukePrac_saved) {
              // now we can test
              done();
            });// lukePrac save
          }); // mattPrac save
        }); // markGame save
      }); // mattGame save
    }); // before each

    // test for game
    it('should have a function to get all players for an event (game)', function(done) {
      Attendance.getPlayersForEvent(game._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        done();
      });
    });

    // test for practice
    it('should have a function to get all players for an event (practice)', function(done) {
      Attendance.getPlayersForEvent(prac._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        done();
      });
    });
  });




  describe('#getPlayerAttendanceForEvent', function(done){
    // these are the attendances we will be using for this
    var mattGame;
    var markGame;
    var mattPrac;
    var lukePrac;

    beforeEach(function(done) {
      mattGame = new Attendance({'event_id': game._id, 'roster_spot_id': mattSpot._id, 'attending': true});
      mattGame.save(function(err, mattGame_saved) {
        markGame = new Attendance({'event_id': game._id, 'roster_spot_id': markSpot._id, 'attending': null});
        markGame.save(function(err, markGame_saved) {
          mattPrac = new Attendance({'event_id': prac._id, 'roster_spot_id': mattSpot._id, 'attending': false});
          mattPrac.save(function(err, mattPrac_saved) {
            lukePrac = new Attendance({'event_id': prac._id, 'roster_spot_id': lukeSpot._id, 'attending': true});
            lukePrac.save(function(err, lukePrac_saved) {
              // now we can test
              done();
            });// lukePrac save
          }); // mattPrac save
        }); // markGame save
      }); // mattGame save
    }); // before each


    it('should have a function to get all players for an event (game)', function(done) {
      Attendance.getPlayerAttendanceForEvent(game._id, function(err, attending, skipping, norespond) {
        attending.should.have.length(1);
        attending[0].should.have.property('attending', true);
        skipping.should.have.length(0);
        norespond.should.have.length(1);
        norespond[0].should.have.property('attending', null);
        done();

      });
    });

    // test for practice
    it('should have a function to get all players for an event (practice)', function(done) {
      Attendance.getPlayerAttendanceForEvent(prac._id, function(err, attending, skipping, norespond) {
        attending.should.have.length(1);
        attending[0].should.have.property('attending', true);
        skipping.should.have.length(1);
        skipping[0].should.have.property('attending', false);
        norespond.should.have.length(0);
        done();
      });
    });

  })



}); // end describe Attendance
