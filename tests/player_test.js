

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
        	var player_object = new Player(testPlayer)
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
        // shouldn't work if the first_name is blank
        it('test2: should not allow a user to be created without a first name', function(done){
        	var no_first_name = new Player({'first_name': '', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
        	no_first_name.save(function(err, returned){
        		// this should result in an error
        		should.exist(err);
        		done();
        	});
        });
        // shouldn't work if the last_name is blank
        it('test3: should not allow a user to be created without a last name', function(done){
        	var no_last_name = new Player({'first_name': 'John', 'last_name': '', 'date_of_birth': '6/25/1992'});
        	no_last_name.save(function(err, returned){
        		should.exist(err);
        		done();
        	});
        });
        // should allow a blank DOB
        it('test4: should allow a user to be created without a date of birth', function(done) {
        	var no_dob = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': ''});
        	no_dob.save(function(err, returned) {
        		should.not.exist(err);
        		done();
        	});
        });
    });

		// tests the name method
		describe('#full_name', function() {
			it('test5: should have a name method that gets the name in first last format', function(done) {
				var john_smith = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
				john_smith.save(function(err, returned) {
					should.not.exist(err);
					should(returned.full_name).equal('John Smith');
					done();
				});
			});
			// testing on another object to ensure full_name doesn't return John Smith every time lol
			it('test6: should have a name method that gets the name in first last format for every player model', function(done) {
				var ed_gruberman = new Player({'first_name': 'Ed', 'last_name': 'Gruberman', 'date_of_birth': '6/25/1992'});
				ed_gruberman.save(function(err, returned) {
					should.not.exist(err);
					should(returned.full_name).equal('Ed Gruberman');
					done();
				});
			});
		});

		//tests the official name method
		describe('#official_name', function() {
			it('test7: should have a name method that returns in last, first format', function(done) {
				var john_smith = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
				john_smith.save(function(err, returned) {
					should.not.exist(err);
					should(returned.official_name).equal('Smith, John');
					done();
				});
			});

			it('test7: should have a name method that returns in last, first format for every player model', function(done) {
				var ed_gruberman = new Player({'first_name': 'Ed', 'last_name': 'Gruberman', 'date_of_birth': '6/25/1992'});
				ed_gruberman.save(function(err, returned) {
					should.not.exist(err);
					should(returned.official_name).equal('Gruberman, Ed');
					done();
				});
			});
		});

});