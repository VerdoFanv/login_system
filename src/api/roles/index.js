const autoBind = require('auto-bind');
const routes = require('./routes');
const RolesHandler = require('./handler');
const RolesService = require('../../service/postgres/RolesService');
const UsersService = require('../../service/postgres/UsersService');

const roles = {
  execute(app) {
    const rolesService = new RolesService();
    const usersService = new UsersService();

    const rolesHandler = new RolesHandler({
      rolesService,
      usersService,
      autoBind,
    });

    routes(app, rolesHandler);
  },
};

module.exports = roles;
