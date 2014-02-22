

var should = require('should');

var player_model = require('../app/models/player');
var mongoose = require('mongoose');
var test_db = mongoose.connect('mongodb://localhost/test-test'); //connection to the testing environment DB

var  Player = mongoose.model('Player');



//mocha stuff
after(function(done){
    test_db.connection.db.dropDatabase(function(){
        test_db.connection.close(function(){
            done();
        });
    });
});


//starting the testing

describe('Player', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
        
        Player.remove(done);//clear out db
 
        testPlayer = {
            first_name: 'Joe',
            last_name: 'User',
            date_of_birth: '6/25/1992'
        };
    });

    after(function(done){
        //clear out db
        Player.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
        var player_object;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            player_object = new Player(testPlayer);
            player_object.save(done);	//if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('test1: should have required properties', function(done){
            player_object.save(function(err, returned){
                // dont do this: if (err) throw err; - use a test
                should.not.exist(err);
                returned.should.have.property('first_name', 'Joe');
                returned.should.have.property('last_name', 'User');
                var testDate = new Date('6/25/1992');
                returned.should.have.property('date_of_birth', testDate);
                done();
            });
        });
    });

});