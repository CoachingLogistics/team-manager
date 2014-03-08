var should = require('should');

process.env.NODE_ENV = 'test';

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);

var event_model = require('../app/models/event');
var mongoose = require('mongoose');
// var test_db = mongoose.connect('mongodb://localhost/team-manager-test'); //connection to the testing environment DB

var Event = mongoose.model('Event');

//mocha stuff
after(function(done){
    // test_db.connection.db.dropDatabase(function(){
    //     test_db.connection.close(function(){
    //         done();
    //     });
    // });
    // console.log("all done");
    done();
});


//starting the testing

describe('Event', function(){    //context, so we can see where tests happen in console

    beforeEach(function(done){  //clears the database and creates testing objects
        
        Event.remove(done);//clear out db
 
        testEvent = {
            // team_id : 1,
            date : '1/1/11',
            // time : '1:00',
            location : 'Wiegand gym',
            type : 'practice'
        };
    });

    after(function(done){
        //clear out db
        Event.remove(done);
    });



//     //testing environment 

//     describe('#save()', function(){
//         var event1;
//         // you can use beforeEach in each nested describe
//         beforeEach(function(done){
//             event1 = new Event(testEvent);
//             event1.save(done); //if you need to link models, do it in this function callback
//         });

//         //finally, the tests
//         it('should have required properties', function(done){
//             event1.save(function(err, returned){
//                 // dont do this: if (err) throw err; - use a test
//                 should.not.exist(err);
//                 // returned.should.have.property('team_id', ?);
//                 returned.should.have.property('date', Date.now);
//                 // returned.should.have.property('time', ?);
//                 returned.should.have.property('location', 'Wiegand gym');
//                 returned.should.have.property('type', 'basketball event');
//                 done();
//             });
//         });
//     });

//     describe('#validators', function(){
//         var bad;
//         // you can use beforeEach in each nested describe
//         beforeEach(function(done){
//             bad = new Event(testEvent);
//             bad.save(done);
//         });


// //start here
// //retrieve time to make sure time zone is correctly stored in db
// //UTC
// //make date from start date and beyond
// //cannot be empty
// //needs to be unique

//         // it('team_id cannot be empty', function(){
//         //     bad.team_id = "";
//         //     bad.validate(function(err, returned){
//         //         err.should.be.ok;
//         //     }); 
//         // });

//         it('date cannot be empty', function(){
//             bad.date = "";
//             bad.validate(function(err, returned){
//                 err.should.be.ok;
//             }); 
//         });

//         // it('time cannot be empty', function(){
//         //     bad.time = "";
//         //     bad.validate(function(err, returned){
//         //         err.should.be.ok;
//         //     });
//         // });

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
//     });//validators



});