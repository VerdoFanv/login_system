const autoBind = require('auto-bind');
const routes = require('./routes');
const UsersHandler = require('./handler');
const UsersService = require('../../service/postgres/UsersService');
const usersValidator = require('../../validator/users');
const RolesService = require('../../service/postgres/RolesService');

const users = {
  execute(app) {
    const usersService = new UsersService();
    const rolesService = new RolesService();
    const usersHandler = new UsersHandler({
      usersService,
      usersValidator,
      rolesService,
      autoBind,
    });

    routes(app, usersHandler);
  },
};

module.exports = users;
