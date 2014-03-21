var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var connection_string = 'localhost/team-manager';
var dev = "localhost/team-manager-development";
var test = "localhost/team-manager-test";
var prod = "localhost/team-manager-production";
// if OPENSHIFT env variables are present, use the available connection info:
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



// Root User:     admin
//    Root Password: g2c6Rt8ylB-K
//    Database Name: express

// Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/