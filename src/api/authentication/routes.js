const routes = (app, handler) => {
  app.post('/login', handler.postAuthenticationHandler);
  app.put('/login', handler.putAuthenticationHandler);
  app.delete('/login', handler.deleteAuthenticationHandler);
};

module.exports = routes;
