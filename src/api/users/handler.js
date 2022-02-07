require('dotenv').config();
const ClientError = require('../../error/ClientError');

class UsersHandler {
  constructor({
    usersService, usersValidator, rolesService, autoBind,
  }) {
    this._usersService = usersService;
    this._usersValidator = usersValidator;
    this._rolesService = rolesService;

    autoBind(this);
  }

  async postUserHandler(req, res) {
    try {
      this._usersValidator.validateAddUsersSchema(req.body);
      const { username, password } = req.body;

      const userId = await this._usersService.addUser({ username, password });
      await this._rolesService.addUserRole(userId);

      const response = {
        status: 'berhasil',
        message: 'Berhasil menambahkan user',
        body: {
          id: userId,
        },
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async getUsersHandler(req, res) {
    try {
      const users = await this._usersService.getUsers();
      const response = {
        status: 'berhasil',
        body: users,
      };

      return res.status(200).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async getUserByIdHandler(req, res) {
    try {
      const id = req.params.id;
      const username = await this._usersService.getUserById(id);

      const response = {
        status: 'berhasil',
        body: username,
      };

      return res.status(200).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async putUserHandler(req, res) {
    try {
      const id = req.params.id;
      this._usersValidator.validateEditUsersSchema(req.body);
      const { username, password } = req.body;

      await this._usersService.editUserById(id, { username, password });

      const response = {
        status: 'berhasil',
        message: 'Berhasil mengedit',
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async deleteUserHandler(req, res) {
    try {
      await this._usersService.deleteUserById(req.params.id);

      const response = {
        status: 'berhasil',
        message: 'Berhasil menghapus',
      };

      return res.status(200).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  _failedResponse(error, res) {
    if (error instanceof ClientError) {
      const responseMessage = {
        status: 'gagal',
        message: error.message,
      };

      return res.status(error.statusCode).send(responseMessage);
    }

    const responseMessage = {
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server',
    };

    return res.status(500).send(responseMessage);
  }
}

module.exports = UsersHandler;
