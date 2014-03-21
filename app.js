var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    if(typeof ipaddress === "undefined") {
	    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
	    ipaddress = "127.0.0.1";
    };


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(config.port, ipaddress, function(){
	console.log("listening on "+ipaddress+":"+config.port+"......")
});


//needed for testing
module.exports = app;
