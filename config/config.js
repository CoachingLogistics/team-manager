var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: 3000,
    db: 'mongodb://localhost/team-manager-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: 3000,
    db: 'mongodb://localhost/team-manager-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'team-manager'
    },
    port: 3000,
    db: 'mongodb://localhost/team-manager-production'
  }
};

module.exports = config[env];
