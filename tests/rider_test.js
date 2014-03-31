/*
 * This is the test file for the rider model
 */

// set the environment to test
process.env.NODE_ENV = 'test';

// required packages
var should = require('should');

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);

// mongoose package and necessary modles
var mongoose = require('mongoose');

var Player = mongoose.model('Player');
var Team = mongoose.model('Team');
var Event = mongoose.model('Event');
var RosterSpot = mongoose.model('RosterSpot');
var Carpool = mongoose.model('Carpool');
var User = mongoose.model('User');
var Rider = mongoose.model('Rider');

// after everything is done
after(function(done) {
  console.log("\nRider tests complete");
  done();
});

// start the tests for rider
describe('Rider', function() {
  // riders need a carpool and a roster spot
  // carpools and roster spots need a team
  // roster spots need a player
  // carpools need an event, which needs a team
  // carpools need a user

  // create the user
  var ed = new User({
    first_name: 'Ed',
    last_name: 'Gruberman',
    email: 'eric@example.com',
    password: "secret",
    phone: "8889882688"
  });

  // create the team
  var flyers = new Team({
    name: "Flyers",
    sport: "Hockey"
  });

  // create an event
  var game = new Event({
    date: new Date(2014, 6, 25, 19, 30),
    location: "WFC",
    type: "game"
  });

  // create another event
  var practice = new Event({
      date : new Date(2014, 6, 24, 10, 30),
      location : 'FSZ',
      type : 'practice'
  });

  // create a carpool
  var gameCarpool= new Carpool({
    location: "5000 Forbes Avenue",
    time: new Date(2014, 6, 25, 18, 00),
    size: 4
  });

  // create another carpool
  var practiceCarpool = new Carpool({
    location: "5000 Forbes Avenue",
    time: new Date(2014, 6, 24, 8, 45),
    size: 4
  });

  // create three players
  // one
  var matt = new Player({
    first_name: "Matt",
    last_name: "Smith",
    date_of_birth: new Date(2000, 1, 1)
  });

  // two
  var mark = new Player({
    first_name: "Mark",
    last_name: "Smith",
    date_of_birth: new Date(2000, 1, 1)
  });

  // three
  var mike = new Player({
    first_name: "Mike",
    last_name: "Smith",
    date_of_birth: new Date(2000, 1, 1)
  });

  var mattPrac = new Rider({
    location: "matts House",
    time: new Date(2014, 6, 24, 8),
    confirmed: true
  });

  var markPrac = new Rider({
    location: "marks House",
    time: new Date(2014, 6, 24, 8, 15),
    confirmed: true
  });

  var mikePrac = new Rider({
    location: "mikes House",
    time: new Date(2014, 6, 24, 8, 30),
    confirmed: true
  });

  var mattGame = new Rider({
    location: "matts House",
    time: new Date(2014, 6, 25, 18),
    confirmed: true
  });

  var markGame = new Rider({
    location: "marks House",
    time: new Date(2014, 6, 25, 18, 15),
    confirmed: true
  });

  var mikeGame = new Rider({
    location: "mikes House",
    time: new Date(2014, 6, 25, 18, 30),
    confirmed: true
  });

  // roster spots
  var mattSpot = new RosterSpot({});
  var markSpot = new RosterSpot({});
  var mikeSpot = new RosterSpot({});

  // before each test
  before(function(done) {
    ed.save(function(err, edSaved) {
      gameCarpool.user_id = edSaved._id;
      practiceCarpool.user_id = edSaved._id;
      flyers.save(function(err, flySaved) {
        game.team_id = flySaved._id;
        practice.team_id = flySaved._id;
        game.save(function(err, gameSaved) {
          practice.save(function(err, practiceSaved) {
            gameCarpool.event_id = gameSaved._id;
            practiceCarpool.event_id = practiceSaved._id;
            gameCarpool.save(function(err, gameCarpoolSaved) {
              practiceCarpool.save(function(err, practiceCarpoolSaved) {
                matt.save(function(err, mattSaved) {
                  mark.save(function(err, markSaved) {
                    mike.save(function(err, mikeSaved) {
                      mattSpot.team_id = flySaved._id;
                      mattSpot.player_id = mattSaved._id;
                      markSpot.team_id = flySaved._id;
                      markSpot.player_id = markSaved._id;
                      mikeSpot.team_id = flySaved._id;
                      mikeSpot.player_id = mikeSaved._id;
                      mattSpot.save(function(err, mattSpotSaved) {
                        mikeSpot.save(function(err, mikeSpotSaved) {
                          markSpot.save(function(err, markSpotSaved) {
                            // create game riders
                            mattGame.roster_spot_id = mattSpotSaved._id;
                            mikeGame.roster_spot_id = mikeSpotSaved._id;
                            markGame.roster_spot_id = markSpotSaved._id;
                            mattGame.carpool_id = gameCarpoolSaved._id;
                            mikeGame.carpool_id = gameCarpoolSaved._id;
                            markGame.carpool_id = gameCarpoolSaved._id;
                            // create practice riders
                            mattPrac.roster_spot_id = mattSpotSaved._id;
                            mikePrac.roster_spot_id = mikeSpotSaved._id;
                            markPrac.roster_spot_id = markSpotSaved._id;
                            mattPrac.carpool_id = practiceCarpoolSaved._id;
                            mikePrac.carpool_id = practiceCarpoolSaved._id;
                            markPrac.carpool_id = practiceCarpoolSaved._id;
                            // save them
                            mattGame.save(function(err, mattGameSaved) {
                              mikeGame.save(function(err, mikeGameSaved) {
                                markGame.save(function(err, markGameSaved) {
                                  mattPrac.save(function(err, mattPracSaved) {
                                    markPrac.save(function(err, markPracSaved) {
                                      mikePrac.save(function(err, mikePracSaved) {
                                        done();
                                      }); // end mikeprac save
                                    }); // end mark prac save
                                  }); // end matt prac save
                                }); // end mark game save
                              }); // end mike game save
                            }); // end matt game save
                          }); // mark spot saved
                        }); //mike spot saved
                      }); // matt spot saved
                    }); // end mike save
                  }); // mark saved
                }); // end matt save
              }); // practice carpool save
            }); // game carpool save
          }); // end practice save
        }); // end game saved
      }); // end flyers saved
    }); // end ed saved
  }); // end before

  // after each test tear it down
  after(function(done) {
    User.remove(function() {
      Player.remove(function() {
        Team.remove(function() {
          Event.remove(function() {
            Carpool.remove(function() {
              RosterSpot.remove(function() {
                Rider.remove(function() {
                  done();
                }); // rider remove
              }); // roster spot remove
            }); // carpool remove
          }); // event remove
        }); // team remove
      }); // player remove
    }); // user remove
  }); // after

  // test that is saves with required properties
  describe('#save', function() {

    it('should have required properties', function(done) {
      mattGame.should.have.property('carpool_id', gameCarpool._id);
      mattGame.should.have.property('roster_spot_id', mattSpot._id);
      mattGame.should.have.property('location', "matts House");
      mattGame.should.have.property('time', new Date(2014, 6, 25, 18));
      mattGame.should.have.property('confirmed', true);
      done();
    });

    it('should not require a carpool_id to be set', function(done) {
      var noCarpool = new Rider({
        location: "my house",
        roser_spot_id: mattSpot._id,
        date: new Date(2014, 6, 25, 12),
        confirmed: true
      });
      noCarpool.save(function(err, noCarpoolSaved) {
        should.not.exist(err);
        noCarpoolSaved.should.have.property('location', 'my house');
        noCarpoolSaved.should.have.property('roster_spot_id', matt._id);
        noCarpoolSaved.should.have.property('event_id', game._id);
        noCarpoolSaved.should.have.property('date', new Date(2014, 6, 25, 12));
        noCarpoolSaved.should.have.property('confirmed', true);
        Rider.remove({_id: noCarpoolSaved._id}, function(err, docs) {
          done();
        });
      });
    });

    it('should require a roster spot id to be created', function(done) {
      var noRosterSpot = new Rider({
        location: "my house",
        carpool_id: gameCarpool._id,
        date: new Date(2014, 6, 25, 12),
        confirmed: true
      });
      noRosterSpot.save(function(err, savedNoRosterSpot) {
        err.should.be.ok();
        done();
      });
    });

    it('confirmed should default to false when created', function(done) {
      var basic = new Rider({
        location: "my house",
        carpool_id: gameCarpool._id,
        date: new Date(2014, 6, 25, 12),
        roster_spot_id: mikeSpot._id
      });
      basic.save(function(err, basicSaved) {
        should.not.exist(err);
        basicSaved.should.have.property('confirmed', false);
        done();
      });
    });
  });

  describe("#getCarpool", function() {
    it('should have a method to get the carpool for a rider', function(done) {
      mikeGame.getCarpool(function(err, carpool) {
        should.not.exist(err);
        carpool.should.have.property('location', "5000 Forbes Avenue");
        carpool.should.have.property('size', 4);
        carpool.should.have.property('_id', gameCarpool._id);
      });
    });
    it('should have a method to get the carpool for a rider part 2', function(done) {
      mattPractice.getCarpool(function(err, carpool) {
        should.not.exist(err);
        carpool.should.have.property('location', "5000 Forbes Avenue");
        carpool.should.have.property('size', 4);
        carpool.should.have.property('_id', practiceCarpool._id);
      });
    });
  });

  describe('#getRosterSpot', function() {
    it('should have a method to get the roster spot for the rider', function(done) {
      mikeGame.getRosterSpot(function(err, rosterSpot) {
        should.not.exist(err);
        rosterSpot.should.have.property('_id', mikeSpot._id);
        done();
      });
    });
  });

  describe('#getRider', function() {
    it('should have a method to get the player for the rider', function(done) {
      mikeGame.getRider(function(err, player) {
        should.not.exist(err);
        player.should.have.property('_id', mike._id);
        done();
      });
    });
    it('should have a method to get the player for the rider x2', function(done) {
      mattPrac.getRider(function(err, player) {
        should.not.exist(err);
        player.should.have.property('_id', matt._id);
        done();
      });
    });
  });

  describe("#getByRosterSpotId", function() {
    it('should have a method to get all of the Riders for a roster spot', function(done) {
      Rider.getByRosterSpotId(mikeSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        docs[0].should.have.property('roster_spot_id', mikeSpot._id);
        docs[1].should.have.property('roster_spot_id', mikeSpot._id);
        done();
      });
    });
    it('should have a method to get all of the Riders for a roster spot', function(done) {
      Rider.getByRosterSpotId(markSpot._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(2);
        docs[0].should.have.property('roster_spot_id', markSpot._id);
        docs[1].should.have.property('roster_spot_id', markSpot._id);
        done();
      });
    });
  });

  describe('#getByCarpoolId', function() {
    it('should have a method to get all of the riders for a carpool', function(done) {
      Rider.getByCarpoolId(gameCarpool._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(3);
        docs[0].should.have.property('carpool_id', gameCarpool._id);
        docs[1].should.have.property('carpool_id', gameCarpool._id);
        docs[2].should.have.property('carpool_id', gameCarpool._id);
        done();
      });
    });

    it('should have a method to get all of the riders for a carpool', function(done) {
      Rider.getByCarpoolId(practiceCarpool._id, function(err, docs) {
        should.not.exist(err);
        docs.should.have.length(3);
        docs[0].should.have.property('carpool_id', practiceCarpool._id);
        docs[1].should.have.property('carpool_id', practiceCarpool._id);
        docs[2].should.have.property('carpool_id', practiceCarpool._id);
        done();
      });
    });
  });
});
