

var should = require('should');

process.env.NODE_ENV = 'test';

//needed to test server requests
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);


//var user_model = require('../app/models/user');
var mongoose = require('mongoose');
// var test_db = mongoose.connect('mongodb://localhost/team-manager-test'); //connection to the testing environment DB

var  User = mongoose.model('User');


//Do we need to test POST requests?
//
//



//mocha stuff
after(function(done){
	console.log("user tests done");
	done();
});


//starting the testing

describe('User', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
        
      User.remove(done);//clear out db

      testUser = {
	      first_name    : 'Ned',
	      last_name    : 'Flanders',
	      email    : 'flanders@gmail.com',
	      password: "secret", 
	      phone: "8089882688"
      };
    });

    after(function(done){
      //clear out db
      User.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
	    var ned;
	    // you can use beforeEach in each nested describe
	    beforeEach(function(done){
	      ned = new User(testUser);
	      ned.save(done);	//if you need to link models, do it in this function callback
	    });

	    //finally, the tests
	    it('should have required properties', function(done){
	      ned.save(function(err, returned){
	        // dont do this: if (err) throw err; - use a test
	        should.not.exist(err);
	        returned.should.have.property('first_name', 'Ned');
	        returned.should.have.property('last_name', 'Flanders');
	        returned.should.have.property('email', 'flanders@gmail.com');
	        returned.should.have.property('phone', "8089882688");

	        returned.should.not.have.property('password', "secret");//password should be hashed
	        done();
	      });
	    });

      it('should have name method', function(done){
        should(ned.name).equal("Ned Flanders");
        done();
      });


    });//save

    describe('#validators', function(){
      var bad;
      // you can use beforeEach in each nested describe
      beforeEach(function(done){
	      bad = new User(testUser);
	      bad.save(done);
      });

      it('email must be right format', function(){
      	bad.email = "none";
          bad.validate(function(err, returned){
              err.should.be.ok;//as in, there is an error
              //err.errors.email.type.should.equal("Email is invalid")
          }).should.throw();
      });

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

      // it('first_name cannot be empty', function(){
      // 	bad.first_name = "";
      //     bad.validate(function(err, returned){
      //         err.should.be.ok;
      //     }); 
      // });

      // it('last_name cannot be empty', function(){
      // 	bad.last_name = "";
      //     bad.validate(function(err, returned){
      //         err.should.be.ok;
      //     });
      // });

      // it('phone cannot be empty', function(){
      // 	bad.phone = "";
      //     bad.validate(function(err, returned){
      //         err.should.be.ok;
      //     });
      // });

      // it('password cannot be empty', function(){
      // 	bad.password = "";
      //     bad.validate(function(err, returned){
      //         err.should.be.ok;
      //     });
      // });


      
    });//validators



    describe("registration route", function(){


        it('registration page', function(done){

          agent.get('/register')
            .expect(200)
            .end(function(err, res){
              if(err) return done(err);
              done();
            });
        });


        it('you can register for an account', function(done){
          agent.post('/register')
          .field('email', "example@gmail.com")
          .field('password', "secret")
          .field('first_name', "John")
          .field('last_name', "Marston")
          .field('phone', "8675309")
          .expect(302)
          .expect('Location', '/')
          .end(function(err, res){
            if(err) return done(err);
            done();
          });
        });
    });


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

        it('login page', function(done){

          agent.get('/login')
            .expect(200)
            .end(function(err, res){
              if(err) return done(err);
              done();
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
        var id;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
            ned = new User(testUser);
            pass = ned.password;
            ned.save();
            id = ned._id;
            done();

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


        it('user show page', function(done){

          agent.get('/users/'+ned._id)
            .expect(200)
            .end(function(err, res){
              if(err) return done(err);
              done();
            });
        });




        it('user edit page', function(done){

          agent.post('/login')
          .field('username', ned.email)
          .field('password', pass)
          .end(function(err, res){
            if(err) return done(err);

            agent.get('/users/'+id+'/edit')
            .expect(200)
            .end(function(err, res){
              if(err) return done(err);
              done();
            });
          });
        });


        it('user edit page only accessible by that user', function(done){

          agent.post('/login')
          .field('username', ned.email)
          .field('password', pass)
          .end(function(err, res){
            if(err) return done(err);

            agent.get('/users/22/edit')
            .expect(302)
            .expect("Location", "/404")
            .end(function(err, res){
              if(err) return done(err);
              done();
            });
          });
        });



        //don't know how to get this confirmed
        it('user can edit their account', function(done){
        	var id = ned._id;

        	agent.post('/login')
        	.field('username', ned.email)
        	.field('password', pass)
        	.end(function(err, res){
        		if(err) return done(err);
	        	agent.post('/user/'+id+'/edit')
            .field('first_name', 'Homer')
            .field('last_name', 'Flanders')
            .field('phone', '911')
            .field('email', 'flanders@gmail.com')
	        	.expect(302)
	        	.end(function(err, res){
	        		if(err) return done(err);
	        		//ned.should.have.property('first_name', 'Homer');
	        		done();
	        	});
	        });
        });



        //don't know how to get this confirmed
        it('user can delete their account', function(done){
        	var id = ned._id;

        	agent.post('/login')
        	.field('username', ned.email)
        	.field('password', pass)
        	.end(function(err, res){
        		if(err) return done(err);

	        	agent.post('/users/'+id+'/delete')
	        	.expect(302)
	        	.end(function(err, res){
	        		if(err) return done(err);
	        		done();
	        	});
	        });
        });





    });//authorization


  describe('scope methods', function(){  //context, so we can see where tests happen in console

      var ned;
      var homer;
      var marge;

    beforeEach(function(done){  //clears the database and creates testing objects

          testUser = {
              first_name    : 'Ned',
              last_name    : 'Flanders',
              email    : 'flanders@gmail.com',
              password: "secret", 
              phone: "8089882688"
          };

          //creates all the users we need. put here to avoid non-unique email errors
          User.remove(function(){
              ned = new User(testUser);
              ned.save(function(err, ned_user){
                  homer = new User({
                      first_name: "Homer",
                      last_name: "Simpson",
                      email: "homer@gmail.com",
                      password: "donuts",
                      phone: "8675309"
                  });
                  homer.save(function(err, ned_user){
                      marge = new User({
                          first_name: "Marge",
                          last_name: "Simpson",
                          email: "marge@gmail.com",
                          password: "blue",
                          phone: "4222222"
                      });
                      marge.save(done);
                  });
              });
          });
      });

      after(function(done){
          //clear out db
          //User.remove(done);
          done();
      });

      it("method getByEmail finds user", function(done){
        User.getByEmail("flanders@gmail.com", function(err, user){
          user.should.have.property("first_name", "Ned");
          user.should.have.property("_id", ned._id);
          done();
        });
      });

      it("method getByEmail returns null", function(done){
        User.getByEmail("fake@gmail.com", function(err, user){
          (user == null).should.be.true;
          done();
        });

      });

  });//scopes



});










