// var should = require('should');

// var event_model = require('../app/models/event');
// var mongoose = require('mongoose');
// var test_db = mongoose.connect('mongodb://localhost/test-test'); //connection to the testing environment DB

// var  Event = mongoose.model('Event');

// //mocha stuff
// after(function(done){
//     test_db.connection.db.dropDatabase(function(){
//         test_db.connection.close(function(){
//             done();
//         });
//     });
// });

// //starting the testing

// describe('Event', function(){	//context, so we can see where tests happen in console

// 	beforeEach(function(done){	//clears the database and creates testing objects
        
//         Event.remove(done);//clear out db
 
//         testEvent = {
//             // team_id    : ?,
//             // date     : ?,
//             // time  : ?,
//             location  : 'Wiegand gym'
//             type  : 'basketball event'
//         };
//     });

//     after(function(done){
//         //clear out db
//         Event.remove(done);
//     });



//     //testing environment 

//     describe('#save()', function(){
//         var event_object;
//         // you can use beforeEach in each nested describe
//         beforeEach(function(done){
//             event_object = new Event(testEvent);
//             event_object.save(done);	//if you need to link models, do it in this function callback
//         });

//         //finally, the tests
//         it('test1: should have required properties', function(done){
//             event_object.save(function(err, returned){
//                 // dont do this: if (err) throw err; - use a test
//                 should.not.exist(err);
//                 returned.should.have.property('team_id', ?);
//                 returned.should.have.property('date', ?);
//                 returned.should.have.property('time', ?);
//                 returned.should.have.property('location', 'Wiegand gym');
//                 returned.should.have.property('type', 'basketball event');
//                 done();
//             });
//         });
//     });

// });











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


//Do we need to test POST requests?
//
//



//mocha stuff
after(function(done){
    // test_db.connection.db.dropDatabase(function(){
    //     test_db.connection.close(function(){
    //         done();
    //     });
    // });
    console.log("all done");
    done();
});


//starting the testing

describe('Event', function(){    //context, so we can see where tests happen in console

    beforeEach(function(done){  //clears the database and creates testing objects
        
        Event.remove(done);//clear out db
 
        testEvent = {
            // team_id : ?,
            // date : ?,
            // time : ?,
            location : 'Wiegand gym'
            type : 'basketball event'
        };
    });

    after(function(done){
        //clear out db
        User.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
        var event1;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            event1 = new Event(testEvent);
            event1.save(done); //if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('should have required properties', function(done){
            event1.save(function(err, returned){
                // dont do this: if (err) throw err; - use a test
                should.not.exist(err);
                // returned.should.have.property('team_id', ?);
                // returned.should.have.property('date', ?);
                // returned.should.have.property('time', ?);
                returned.should.have.property('location', 'Wiegand gym');
                returned.should.have.property('type', 'basketball event');
                done();
            });
        });
    });

    describe('#validators', function(){
        var bad;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            bad = new Event(testEvent);
            bad.save(done);
        });


//start here
//retrieve time to make sure time zone is correctly stored in db
//UTC
//make date from start date and beyond
//cannot be empty
//needs to be unique

        it('email cannot be empty', function(){
            bad.email = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            }); 
        });

        it('email must be unique', function(){
            var copy = new User(testUser);
            copy.validate(function(err, returned){
                //throws a duplicate key exception
            }).should.throw();
        });

        it('first_name cannot be empty', function(){
            bad.first_name = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            }); 
        });

        it('last_name cannot be empty', function(){
            bad.last_name = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            });
        });

        it('phone cannot be empty', function(){
            bad.phone = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            });
        });

        it('password cannot be empty', function(){
            bad.password = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            });
        });
    });//validators


    describe('#login and logout', function(){
        var ned;
        var pass;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            ned = new User(testUser);
            pass = ned.password;
            ned.save(done);
        });

        it('unitialized user should not have an access token', function(){
            ned.save(function(err, returned){
                should.not.exist(err);
                returned.should.not.have.ownProperty('accessToken');
            });
        });

        it('user can login', function(done){
            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res){
                if(err) return done(err);
                done();
            });
        });

        //not exactly sure how to do this one
        it('user has accessToken after logging in', function(done){
            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res){
                if(err) return done(err);
                done();
            });
        });

        it('user can logout', function(done){
            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res){
                if(err) return done(err);
                agent.get('/logout')
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    //can run further test to ensure they're signed out
                    if(err) return done(err);
                    done()
                });
            });
        });

    });//login and logout


    describe('#authorization', function(){
        var ned;
        var pass;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            ned = new User(testUser);
            pass = ned.password;
            ned.save(done);

            //I want to do this, but i can't
            //agent.post('/login')
            // .field('username', ned.email)
            // .field('password', pass)
            // .end(done);
        });

        it('user can access their account', function(done){
            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .end(function(err, res){
                if(err) return done(err);

                agent.get('/account')
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);
                    done();
                });
            });
        });



        //don't know how to get this working
        it('user can edit their account', function(done){
            var id = ned._id;

            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .end(function(err, res){
                if(err) return done(err);

                agent.post('/user/'+id+'/edit')
                .field('first_name', 'Homer')
                .expect(302)
                .end(function(err, res){
                    if(err) return done(err);
                    //ned.should.have.property('first_name', 'Homer');
                    done();
                });
            });
        });

        //don't know how to get this working
        it('user can delete their account', function(done){
            var id = ned._id;

            agent.post('/login')
            .field('username', ned.email)
            .field('password', pass)
            .end(function(err, res){
                if(err) return done(err);

                agent.post('/user/'+id+'/delete')
                .expect(302)
                .end(function(err, res){
                    if(err) return done(err);
                    //ned.should.have.property('first_name', 'Homer');
                    done();
                });
            });
        });





    });//authorization











});