const { AddUsersSchema, EditUsersSchema } = require('./schema');
const InvariantError = require('../../error/InvariantError');

const UsersValidator = {
  validateAddUsersSchema(payload) {
    const validationResult = AddUsersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError('Kredensial yang diberikan salah');
    }
  },
  validateEditUsersSchema(payload) {
    const validationResult = EditUsersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError('Kredensial yang diberikan salah');
    }
  },
};

module.exports = UsersValidator;
