const scanAuthorizationAccess = require('../scanAuthorizationAccess');

const routes = (app, handler) => {
  app.post('/roles/admin/:id', scanAuthorizationAccess, handler.postAdminRoleHandler);
  app.post('/roles/user/:id', scanAuthorizationAccess, handler.postUserRoleHandler);
  app.get('/roles/:id', scanAuthorizationAccess, handler.getRoleByUserIdHandler);
  app.put('/roles/admin/:id', scanAuthorizationAccess, handler.putAdminRoleHandler);
  app.put('/roles/user/:id', scanAuthorizationAccess, handler.putUserRoleHandler);
  app.delete('/roles/:id', scanAuthorizationAccess, handler.deleteRoleHandler);
};

module.exports = routes;
