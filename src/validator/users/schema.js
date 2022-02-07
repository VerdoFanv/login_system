const Joi = require('joi');

const AddUsersSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});

const EditUsersSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
});

module.exports = { AddUsersSchema, EditUsersSchema };
