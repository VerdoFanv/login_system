const autoBind = require('auto-bind');
const routes = require('./routes');
const AuthenticationHandler = require('./handler');
const UsersService = require('../../service/postgres/UsersService');
const authenticationValidator = require('../../validator/authentication');
const AuthenticationService = require('../../service/postgres/AuthenticationService');
const tokenManager = require('../../tokenize/tokenManager');

const authentication = {
  execute(app) {
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationService();

    const authenticationHandler = new AuthenticationHandler({
      usersService,
      authenticationsService,
      authenticationValidator,
      tokenManager,
      autoBind,
    });

    routes(app, authenticationHandler);
  },
};

module.exports = authentication;
