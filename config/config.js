var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

//local dbs, if OPENSHIFT is not detected
var connection_string = 'localhost/team-manager';
var dev = "localhost/team-manager-development";
var test = "localhost/team-manager-test";
var prod = "localhost/team-manager-production";

// if OPENSHIFT env variables are present, uses the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
  dev = connection_string;
  test = connection_string;
  prod = connection_string;
}

var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000';


//to access the production database, reference https://www.openshift.com/blogs/getting-started-with-mongodb-on-nodejs-hosting

//you will need to first clone the production app from openshift
//then download the rhc command line tool:  https://www.openshift.com/developers/rhc-client-tools-install
//run "rhc ssh" and that will put you in the production environment
//reference https://www.openshift.com/blogs/getting-started-with-mongodb-on-nodejs-hosting for the rest

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: port || 3000,
    db: 'mongodb://'+dev
  },

  test: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: port || 3000,
    db: 'mongodb://'+test
  },

  production: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: port || 3000,
    db: 'mongodb://'+prod
  }
};

module.exports = config[env];
