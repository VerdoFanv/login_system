const scanAuthorizationAccess = require('../scanAuthorizationAccess');

const routes = (app, handler) => {
  app.post('/users', handler.postUserHandler);
  app.get('/users', handler.getUsersHandler);
  app.get('/users/:id', handler.getUserByIdHandler);
  app.put('/users/:id', scanAuthorizationAccess, handler.putUserHandler);
  app.delete('/users/:id', scanAuthorizationAccess, handler.deleteUserHandler);
};

module.exports = routes;
