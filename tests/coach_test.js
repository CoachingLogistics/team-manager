process.env.NODE_ENV = 'test';
// required modules/packages
var should = require('should');
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);
var mongoose = require('mongoose');
// Schemas
var  User = mongoose.model('User');
var  Team = mongoose.model('Team');
var  Coach = mongoose.model('Coach');

//mocha stuff
after(function(done){
	console.log("\ncoach tests done");
	done();
});

// testing coaches here
describe('Coach', function() {
	var austin;
	var craig;
	var peter;

	// set the users
	beforeEach(function(done) {
		Team.remove();
		Coach.remove();

		testUser = {
			first_name: "Ed",
			last_name: "Austin",
			email: "ed@example.com",
			password: "secret",
			phone: "1234567890"
		};

		testTeam = {
			name: "Hawks",
			sport: "Hockey"
		};

		testCoach = {
			user_id: null,
			team_id: null
		};

		User.remove(function() {
			// ed austin
			austin = new User(testUser);
			austin.save(function(err, ed_user) {
				// craig
				craig = new User({'first_name': 'Craig', 'last_name': 'Berube', 'email': 'craig@example.com', 'password': 'secret', 'phone': '0987654321'});
				craig.save(function(err, craig_user) {
					// finally peter
					peter = new User({'first_name': 'Peter', 'last_name': 'Laviolette', 'email': 'peter@example.com', 'password': 'secret', 'phone': '1231231234'});
					peter.save(done);
				}); // craig save
			}); // austin save
		}); // User.remove
	}); // before each

	after(function(done) {
		done();
	});

	// time to test save
	describe('#save()', function(done) {
		var fly;
		var prep;
		var prep_coach;
		var fly_coach_1;
		var fly_coach_2;

		beforeEach(function(done) {
			prep = new Team(testTeam);
			prep.save(function(err, prep_saved) {
				if(err) {
					console.log(err);
					return done(err);
				}
				else {
					fly = new Team({'name': 'Flyers', 'sport': 'Hockey'});
					fly.save(function(err, fly_saved) {
						if(err) {
							console.log(err);
							return done(err);
						}
						// now I have both teams saved and all users created, so...
						prep_coach = new Coach({'team_id': prep_saved._id, 'user_id': austin._id});
						prep_coach.save(function(err, pc_saved) {
							if(err) {
								console.log(err);
								return done(err);
							}
							fly_coach_1 = new Coach({'team_id': fly_saved._id, 'user_id': peter._id});
							fly_coach_1.save(function(err, fc1_saved) {
								if(err){ 
									console.log(err);
									return done(err);
								}
								fly_coach_2 = new Coach({'team_id': fly_saved._id, 'user_id': craig._id});
								fly_coach_2.save(done);
							});
						});
					});
				}
			});
		});
		// above saves should have worked
		it('should have the proper ids set', function(done) {
			prep_coach.should.have.property('user_id', austin._id);
			prep_coach.should.have.property('team_id', prep._id);
			fly_coach_1.should.have.property('team_id', fly._id);
			fly_coach_1.should.have.property('user_id', peter._id);
			fly_coach_2.should.have.property('team_id', fly._id);
			fly_coach_2.should.have.property('user_id', craig._id);
			done();
		});
		// should have presence validations for user_id
		it('should not allow user_id to be blank', function(done) {
			prep_coach.user_id = null;
			prep_coach.validate(function(err, returned) {
				should.exist(err);
				fly_coach_1.user_id = null;
				fly_coach_1.validate(function(err, returned) {
					should.exist(err);
					fly_coach_2.user_id = null;
					fly_coach_2.validate(function(err, returned) {
						should.exist(err);
						done();
					});
				});
			});
		});
		// should have presence validations for team_id
		it('should not allow team_id to be blank', function(done) {
			prep_coach.team_id = null;
			prep_coach.validate(function(err, returned) {
				should.exist(err);
				fly_coach_1.team_id = null;
				fly_coach_1.validate(function(err, returned) {
					should.exist(err);
					fly_coach_2.team_id = null;
					fly_coach_2.validate(function(err, returned) {
						should.exist(err);
						done();
					});
				});
			});
		});
	});// save

	// get by team id
	describe('#getByTeamId()', function(done) {
		// probably could have better utalized code reuse but whatever
		var fly;
		var prep;
		var prep_coach;
		var fly_coach_1;
		var fly_coach_2;

		beforeEach(function(done) {
			prep = new Team(testTeam);
			prep.save(function(err, prep_saved) {
				if(err) {
					console.log(err);
					return done(err);
				}
				else {
					fly = new Team({'name': 'Flyers', 'sport': 'Hockey'});
					fly.save(function(err, fly_saved) {
						if(err) {
							console.log(err);
							return done(err);
						}
						// now I have both teams saved and all users created, so...
						prep_coach = new Coach({'team_id': prep_saved._id, 'user_id': austin._id});
						prep_coach.save(function(err, pc_saved) {
							if(err) {
								console.log(err);
								return done(err);
							}
							fly_coach_1 = new Coach({'team_id': fly_saved._id, 'user_id': peter._id});
							fly_coach_1.save(function(err, fc1_saved) {
								if(err){ 
									console.log(err);
									return done(err);
								}
								fly_coach_2 = new Coach({'team_id': fly_saved._id, 'user_id': craig._id});
								fly_coach_2.save(done);
							});
						});
					});
				}
			});
		});
		// test the method
		it('should have a method to get coaches by team id', function(done) {
			Coach.getByTeamId(prep._id, function(err, coaches) {
				should.not.exist(err);
				should(coaches.length).equal(1);
				coaches[0].should.have.property('team_id', prep._id);
				coaches[0].should.have.property('user_id', austin._id);
				done();
			});
		});
		// test it returns multiple coaches if necessary
		it('should have a method to get ALL coaches by team id', function(done) {
			Coach.getByTeamId(fly._id, function(err, coaches) {
				should.not.exist(err);
				should(coaches.length).equal(2);
				coaches[0].should.have.property('team_id', fly._id);
				coaches[1].should.have.property('team_id', fly._id);
				done();
			});
		});
	});
	// get by user id
	describe('#getByTeamId()', function(done) {
		// probably could have better utalized code reuse but whatever
		var fly;
		var prep;
		var prep_coach_1;
		var prep_coach_2;
		var fly_coach_1;
		var fly_coach_2;

		beforeEach(function(done) {
			prep = new Team(testTeam);
			prep.save(function(err, prep_saved) {
				if(err) {
					console.log(err);
					return done(err);
				}
				else {
					fly = new Team({'name': 'Flyers', 'sport': 'Hockey'});
					fly.save(function(err, fly_saved) {
						if(err) {
							console.log(err);
							return done(err);
						}
						// now I have both teams saved and all users created, so...
						prep_coach_1 = new Coach({'team_id': prep_saved._id, 'user_id': austin._id});
						prep_coach_1.save(function(err, pc_saved) {
							if(err) {
								console.log(err);
								return done(err);
							}
							fly_coach_1 = new Coach({'team_id': fly_saved._id, 'user_id': peter._id});
							fly_coach_1.save(function(err, fc1_saved) {
								if(err){ 
									console.log(err);
									return done(err);
								}
								fly_coach_2 = new Coach({'team_id': fly_saved._id, 'user_id': craig._id});
								fly_coach_2.save(function(err, fc2_saved) {
									if(err) {
										console.log(err);
										return done(err);
									}
									prep_coach_2 = new Coach({'team_id': prep_saved._id, 'user_id': peter._id});
									prep_coach_2.save(done);
								});
							});
						});
					});
				}
			});
		});
		// test the method
		it('should have a method to get coaches by user id', function(done) {
			Coach.getByUserId(craig._id, function(err, coaches) {
				should.not.exist(err);
				should(coaches.length).equal(1);
				coaches[0].should.have.property('team_id', fly._id);
				coaches[0].should.have.property('user_id', craig._id);
				done();
			});
		});
		// test it returns multiple coaches if necessary
		it('should have a method to get ALL coaches by user id', function(done) {
			Coach.getByUserId(peter._id, function(err, coaches) {
				should.not.exist(err);
				should(coaches.length).equal(2);
				coaches[0].should.have.property('user_id', peter._id);
				coaches[1].should.have.property('user_id', peter._id);
				done();
			});
		});
	});
	describe('#getUsersForTeam()', function(done) {
		var fly;
		var fly_coach_1;
		var fly_coach_2;
		var prep;
		var prep_coach;
		beforeEach(function(done) {
			fly = new Team(testTeam);
			fly.save(function(err, fly_saved) {
				if(err) {
					console.log(err);
					return done(err);
				}
				fly_coach_1 = new Coach({'team_id': fly_saved._id, 'user_id': peter._id});
				fly_coach_1.save(function(err, flc1_saved) {
					if(err) {
						console.log(err);
						return done(err);
					}
					fly_coach_2 = new Coach({'team_id': fly_saved._id, 'user_id': craig._id});
					fly_coach_2.save(function(err, fc2_saved) {
						prep = new Team({'name': 'Hawks', 'sport': 'Hockey'});
						prep.save(function(err, prep_saved) {
							prep_coach = new Coach({'team_id': prep_saved._id, 'user_id': austin._id});
							prep_coach.save(done);
						});
					});
				});
			});
		});
		it('should have a function to get users coaching a team', function(done) {
			Coach.getUsersForTeam(fly._id, function(err, users) {
				users.should.have.length(2);
				done();
			});
		});
		it('should only return one user if the team has one coach', function(done) {
			Coach.getUsersForTeam(prep._id, function(err, users) {
				users.should.have.length(1);
				users[0].should.have.property('_id', austin._id);
				done();
			});
		});
	});
	


});