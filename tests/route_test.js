
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