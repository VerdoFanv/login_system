// api
const authentication = require('./api/authentication');
const users = require('./api/users');
const roles = require('./api/roles');

const useCaseContainer = [
  authentication,
  users,
  roles,
];

module.exports = useCaseContainer;
