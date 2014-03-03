

 var should = require('should');

 process.env.NODE_ENV = 'test';

 var app = require("../app");
 var request = require("supertest");
 var agent = request.agent(app);

 var team_model = require('../app/models/team');
 var mongoose = require('mongoose');
 //var test_db = mongoose.connect('mongodb://localhost/team-manager-test'); //connection to the testing environment DB

 var Team = mongoose.model('Team');



//mocha stuff
after(function(done){
    //test_db.connection.db.dropDatabase(function(){
    //    test_db.connection.close(function(){
            done();
    //    });
    //});
});


//starting the testing

describe('Team', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
        
        Team.remove(done);//clear out db
 
        testTeam = {
            name    : 'Test',
            sport     : 'Soccer'
        };
    });

    after(function(done){
        //clear out db
        Team.remove(done);
    });



    //testing environment 

    describe('#save', function(){
        var team_object;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            team_object = new Team(testTeam);
            team_object.save(done);	//if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('test1: should have required properties', function(done){
            team_object.save(function(err, returned){
                // dont do this: if (err) throw err; - use a test
                should.not.exist(err);
                returned.should.have.property('name', 'Test');
                returned.should.have.property('sport', 'Soccer');
                // returned.should.have.property('team_type', 'practice');
                // returned.should.have.property('team_num', 1);
                //returned.should.have.property('start_time', Date.now);
                done();
            });
        });
    });

    describe('#validators', function(){
        var bad;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            bad = new Team(testTeam);
            bad.save(done);
        });

        it('team name must not be empty', function(done){
        	bad.name = "";
            bad.validate(function(err, returned){
                err.should.be.ok;//as in, there is an error
            }).should.throw();
            done();
        });

        it('sport cannot be empty', function(done){
        	bad.sport = "";
            bad.validate(function(err, returned){
                err.should.be.ok;
            });
            done();
        });
    });//validators

    describe('#routes', function(){

    });//validators

});