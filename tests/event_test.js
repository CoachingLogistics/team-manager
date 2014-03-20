var should = require('should');

process.env.NODE_ENV = 'test';

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);

var event_model = require('../app/models/event');
var mongoose = require('mongoose');
// var test_db = mongoose.connect('mongodb://localhost/team-manager-test'); //connection to the testing environment DB

var Team = mongoose.model('Team');
var Event = mongoose.model('Event');

var today = new Date();
var month = today.getMonth();
var day = today.getDate();
var year = today.getFullYear();
var time = today.getTime();

//mocha stuff
after(function(done){
    // test_db.connection.db.dropDatabase(function(){
    //     test_db.connection.close(function(){
    //         done();
    //     });
    // });
    console.log("event tests done");
    done();
});


//starting the testing

describe('Event', function(){    //context, so we can see where tests happen in console

    beforeEach(function(done){  //clears the database and creates testing objects
        
        Event.remove();//clear out db
        Team.remove(done);


        testEvent = {
            // team_id : 1,
            date : new Date(2014, 2, 24, 16, 20),
            location : 'Wiegand gym',
            type : 'practice'
        };

        testTeam = {
            name: 'Purple Cobras',
            sport: 'Dodgeball'
        }
    });

    after(function(done){
        //clear out db
        Team.remove();
        Event.remove(done);
    });



//     //testing environment 

    describe('#testing', function(){

        var ev1, ev2, ev3, cobras, joes;

        // you can use beforeEach in each nested describe
        beforeEach(function(done){

            joes = new Team({
                name: "Average Joes",
                sport: "Dodgeball"
            });

            cobras = new Team({
                name: "Purple Cobras",
                sport: "Dodgeball"
            });

            joes.save(function(err, avg){
                ev1 = new Event({
                    team_id: avg._id,
                    date : new Date(year, month, day+7, 16, 20),
                    location : 'Average Joes Gymnasium',
                    type : 'Practice'
                });

                ev1.save(function(err, event1){

                    ev2 = Event({
                        team_id: avg._id,
                        date : new Date(year, month, day-3, 4, 20),
                        location : 'Wiegand gym',
                        type : 'Practice'
                    });

                    ev2.save(function(err, event2){
                        cobras.save(function(err, purps){
                            ev3 = new Event({
                                team_id: purps._id,
                                date : new Date(year, month-2, day-7, 12, 00),
                                location : 'Globo Gym',
                                type : 'Game'
                            });

                            ev3.save(function(err, event3){
                                done();
                            })

                        })
                    })

                })
            });

        });

        //finally, the tests
        it('should have required properties', function(done){
            ev1.save(function(err, returned){
                // dont do this: if (err) throw err; - use a test
                should.not.exist(err);
                returned.should.have.property('team_id', joes._id);
                returned.should.have.property('date', new Date(year, month, day+7, 16, 20));
                returned.should.have.property('location', 'Average Joes Gymnasium');
                returned.should.have.property('type', 'Practice');
                done();
            });
        });

        it('should have a method that returns time', function(done){

            should(ev1.time).equal("4:20 PM");
            should(ev2.time).equal("4:20 AM");
            should(ev3.time).equal("12:00 PM");
            done();
        });

        it('should have a class method getByTeamId', function(done){

            Event.getByTeamId(cobras._id, function(err, events){
                events.should.have.length(1);
                events[0].should.have.property('team_id', cobras._id);
                events[0].should.have.property('date', new Date(year, month-2, day-7, 12, 00));
                events[0].should.have.property('location', 'Globo Gym');
                events[0].should.have.property('type', 'Game');

                Event.getByTeamId(joes._id, function(err, events){
                    events.should.have.length(2);
                    events[0].should.have.property('team_id', joes._id);
                    events[0].should.have.property('date', new Date(year, month, day-3, 4, 20));
                    events[1].should.have.property('date', new Date(year, month, day+7, 16, 20));
                
                    done();
                });

            });

        });

        it('should have a class method getUpcomingByTeamId', function(done){

            Event.getUpcomingByTeamId(cobras._id, function(err, events){
                events.should.have.length(0);

                Event.getUpcomingByTeamId(joes._id, function(err, events){
                    events.should.have.length(1);
                    events[0].should.have.property('team_id', joes._id);
                    events[0].should.have.property('date', new Date(year, month, day+7, 16, 20));
                
                    done();
                });

            });

        });


        it('should have a method that returns the Team', function(done){
            ev1.getTeam(function(err, team1){
                team1.should.have.property('name', 'Average Joes');

                ev2.getTeam(function(err, team2){
                    team2.should.have.property('name', 'Average Joes');

                    ev3.getTeam(function(err, team3){
                        team3.should.have.property('name', 'Purple Cobras');

                        done();
                    });
                });
            });
        });




        describe('#validators', function(){
            var bad;
            // you can use beforeEach in each nested describe
            beforeEach(function(done){

                bad = new Event(testEvent);
                bad.team_id = joes._id;
                bad.save(done);
            });


    // //start here
    // //retrieve time to make sure time zone is correctly stored in db
    // //UTC
    // //make date from start date and beyond
    // //cannot be empty
    // //needs to be unique

            it('team_id cannot be empty', function(){
                bad.team_id = null;
                bad.validate(function(err, returned){
                    err.should.be.ok;
                });
            });

            it('date cannot be empty', function(){
                bad.date = null;
                bad.validate(function(err, returned){
                    err.should.be.ok;
                });
            });

    //         it('location cannot be empty', function(){
    //             bad.location = "";
    //             bad.validate(function(err, returned){
    //                 err.should.be.ok;
    //             });
    //         });

    //         it('type cannot be empty', function(){
    //             bad.type = "";
    //             bad.validate(function(err, returned){
    //                 err.should.be.ok;
    //             });
    //         });
        });//validators

});//describe #testing

});