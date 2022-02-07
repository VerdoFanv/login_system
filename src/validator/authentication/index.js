const { authenticationSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require('./schema');
const InvariantError = require('../../error/InvariantError');

const authenticationValidator = {
  validateAuthenticationPayload(payload) {
    const validationResult = authenticationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError('Kredensial yang dibutuhkan tidak sesuai!');
    }
  },
  validatePutAuthenticationPayload(payload) {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError('Token tidak sesuai');
    }
  },
  validateDeleteAuthenticationPayload(payload) {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError('Token tidak sesuai');
    }
  },
};

module.exports = authenticationValidator;
