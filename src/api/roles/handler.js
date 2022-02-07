const ClientError = require('../../error/ClientError');

class RolesHandler {
  constructor({ rolesService, usersService, autoBind }) {
    this._service = rolesService;
    this._usersService = usersService;

    autoBind(this);
  }

  async postUserRoleHandler(req, res) {
    try {
      await this._usersService.verifyExistUserById(req.params.id);
      await this._service.addUserRole(req.params.id);
      const response = {
        status: 'berhasil',
        message: 'Berhasil menambahkan role user',
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async postAdminRoleHandler(req, res) {
    try {
      await this._usersService.verifyExistUserById(req.params.id);
      await this._service.addAdminRole(req.params.id);
      const response = {
        status: 'berhasil',
        message: 'Berhasil menambahkan role admin',
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async getRoleByUserIdHandler(req, res) {
    try {
      const { user_id, role } = await this._service.getRoleByUserId(req.params.id);

      const response = {
        status: 'berhasil',
        data: {
          userId: user_id,
          userRole: (role > 1 ? 'User' : 'Admin'),
        },
      };

      return res.status(200).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async putAdminRoleHandler(req, res) {
    try {
      await this._usersService.verifyExistUserById(req.params.id);
      await this._service.editRoleToAdminByUserId(req.params.id);
      const response = {
        status: 'berhasil',
        message: 'Berhasil mengubah role menjadi admin',
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async putUserRoleHandler(req, res) {
    try {
      await this._usersService.verifyExistUserById(req.params.id);
      await this._service.editRoleToUserByUserId(req.params.id);
      const response = {
        status: 'berhasil',
        message: 'Berhasil mengubah role menjadi user',
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async deleteRoleHandler(req, res) {
    try {
      await this._usersService.verifyExistUserById(req.params.id);
      await this._service.deleteRoleByUserId(req.params.id);
      const response = {
        status: 'berhasil',
        message: 'Berhasil menghapus role',
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

module.exports = RolesHandler;
