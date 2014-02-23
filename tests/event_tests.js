var should = require('should');

var event_model = require('../app/models/event');
var mongoose = require('mongoose');
var test_db = mongoose.connect('mongodb://localhost/test-test'); //connection to the testing environment DB

var  Event = mongoose.model('Event');

//mocha stuff
after(function(done){
    test_db.connection.db.dropDatabase(function(){
        test_db.connection.close(function(){
            done();
        });
    });
});

//starting the testing

describe('Event', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
        
        Event.remove(done);//clear out db
 
        testEvent = {
            // team_id    : ?,
            // date     : ?,
            // time  : ?,
            location  : 'Wiegand gym'
            type  : 'basketball event'
        };
    });

    after(function(done){
        //clear out db
        Event.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
        var event_object;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            event_object = new Event(testEvent);
            event_object.save(done);	//if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('test1: should have required properties', function(done){
            event_object.save(function(err, returned){
                // dont do this: if (err) throw err; - use a test
                should.not.exist(err);
                returned.should.have.property('team_id', ?);
                returned.should.have.property('date', ?);
                returned.should.have.property('time', ?);
                returned.should.have.property('location', 'Wiegand gym');
                returned.should.have.property('type', 'basketball event');
                done();
            });
        });
    });

});