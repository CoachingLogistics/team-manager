
var should = require('should');

process.env.NODE_ENV = 'test';

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);


var mongoose = require('mongoose');

var User = mongoose.model('User');
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
    last_name    : 'McCormick',
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

  var carp_e_1= new Carpool({
    //user: eric
    //event: event1
    location: "500 Forbes Avenue",
    time: new Date(2014, 2, 24, 16, 20),
    size: 4
  });

  var carp_s_1= new Carpool({
    //user: stan
    //event: event1
    location: "500 Forbes Avenue",
    time: new Date(2014, 2, 24, 12, 20),
    size: 3
  });

  var carp_s_2= new Carpool({
    //user: stan
    //event: event2
    location: "500 Forbes Avenue",
    time: new Date(2014, 2, 24, 14, 0),
    size: 3
  });

  var carp_k_2= new Carpool({
    //user: kenny
    //event: event2
    location: "500 Forbes Avenue",
    time: new Date(2014, 2, 24, 16, 20),
    size: 2
  });

  before(function(done){
   User.remove(function(){//clear dbs before we start putting in objects
      Event.remove(function(){
        Team.remove(function(){
          Carpool.remove(function(){

                //put in objects
                cobras.save(function(error, team){  //team
                  event1.team_id = team._id;
                  event2.team_id = team._id;

                  eric.save(function(err, eric_user){//users
                    carp_e_1.user_id = eric_user._id;

                    stan.save(function(err, stan_user){
                      carp_s_1.user_id = stan_user._id;
                      carp_s_2.user_id = stan_user._id;

                      kenny.save(function(err, ken_user){
                        carp_k_2.user_id = ken_user._id;

                        event1.save(function(err, ev1){//events
                          carp_s_1.event_id = ev1._id;
                          carp_e_1.event_id = ev1._id;

                          event2.save(function(err, ev2){
                            carp_k_2.event_id = ev2._id;
                            carp_s_2.event_id = ev2._id;

                            carp_e_1.save(function(e, cp){
                              carp_s_1.save(function(e, cp){
                                carp_s_2.save(function(e, cp){
                                  carp_k_2.save(function(e, cp){
                                    done();

                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })//cobras
          })
        })
      })
    })


    testCarpool = {
      //user_id:
      //event_id:
      location: "My House",
      time: new Date(2014, 4, 24, 12, 34),
      size: 3
    };

  });//before


  after(function(done){

     User.remove(function(){//clear dbs
        Event.remove(function(){
          Team.remove(function(){
            Carpool.remove(done)
          })
        })
      })

  });


    //team, eric, stan, kenny, event1, event2, carp_e_1, carp_s_1, carp_s_2, carp_k_2
  describe('#save()', function(){

        //finally, the tests
        it('should have required properties', function(done){


            carp_e_1.should.have.property('user_id', eric._id);
            carp_e_1.should.have.property('event_id', event1._id);
            carp_e_1.should.have.property('location', "500 Forbes Avenue");
            carp_e_1.should.have.property('time', new Date(2014, 2, 24, 16, 20));
            carp_e_1.should.have.property('size', 4);


            done();
        });

        it('should have time method', function(done){
          should(carp_s_2.getTime()).equal("2:00 PM");
          done();
        });


  });//save

  describe('#validators', function(){
      var bad;
      // you can use beforeEach in each nested describe
      beforeEach(function(done){
        bad = new Carpool(testCarpool);
        done();
      });

      it('event_id must be present', function(done){
        bad.user_id = eric._id;
          bad.validate(function(err, returned){
              err.should.be.ok;//as in, there is an error
              done();
          }).should.throw();
      });

      it('user_id must be present', function(done){
        bad.event_id = event1._id;
          bad.validate(function(err, returned){
              err.should.be.ok;//as in, there is an error
              done();
          }).should.throw();
      });

      it('size must be present', function(done){
        bad.user_id = eric._id;
        bad.event_id = event1._id;
        bad.size = null;
          bad.validate(function(err, returned){
              err.should.be.ok;//as in, there is an error
              done();
          }).should.throw();
      });

  });//validators




  describe('instance methods', function(){


    it('has getUser method', function(done){

      carp_e_1.getUser(function(err, cartman){
        cartman.should.have.property('_id', eric._id);
        cartman.should.have.property('first_name', 'Eric');

        carp_k_2.getUser(function(err, ken){

          ken.should.have.property('_id', kenny._id);
          done();

        });
      });

    });

    it('has getEvent method', function(done){

      carp_e_1.getEvent(function(err, ev1){
        ev1.should.have.property('_id', event1._id);
        ev1.should.have.property('type', 'practice');

        carp_k_2.getEvent(function(err, ev2){

          ev2.should.have.property('_id', event2._id);
          done();

        });
      });
    });


  })//instance methods

  describe('scope methods', function(){


    it('has getByIds method', function(done){
      Carpool.getByIds(eric._id, event1._id, function(err, carpool){
        carpool.should.have.property('_id', carp_e_1._id);

        Carpool.getByIds(kenny._id, event2._id, function(err, cp){
          cp.should.have.property('_id', carp_k_2._id);

          done();
        })
      })
    });


    it('has getByEventId method', function(done){
      Carpool.getByEventId(event1._id, function(err, carpools){
        carpools.should.have.length(2)
        carpools[0].should.have.property('event_id', event1._id);
        carpools[1].should.have.property('event_id', event1._id);

        Carpool.getByEventId(event2._id, function(err, cps){
          cps.should.have.length(2)
          cps[0].should.have.property('event_id', event2._id);
          cps[1].should.have.property('event_id', event2._id);

          done();
        })
      })

    });


    it('has getByUserId method', function(done){
      Carpool.getByUserId(eric._id, function(err, carpools){
        carpools.should.have.length(1)
        carpools[0].should.have.property('event_id', event1._id);
        carpools[0].should.have.property('user_id', eric._id);

        Carpool.getByUserId(kenny._id, function(err, cps){
          cps.should.have.length(1)
          cps[0].should.have.property('event_id', event2._id);
          cps[0].should.have.property('user_id', kenny._id);

          Carpool.getByUserId(stan._id, function(err, pools){
            pools.should.have.length(2)
            pools[0].should.have.property('user_id', stan._id);
            pools[1].should.have.property('user_id', stan._id);
            
            done();
          }) 
        })
      })
    });


  });




});