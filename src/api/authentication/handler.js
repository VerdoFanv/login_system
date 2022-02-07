const ClientError = require('../../error/ClientError');

class AuthenticationHandler {
  constructor({
    usersService, authenticationsService, authenticationValidator, autoBind, tokenManager,
  }) {
    this._usersService = usersService;
    this._authenticationsService = authenticationsService;
    this._authenticationValidator = authenticationValidator;
    this._tokenManager = tokenManager;

    autoBind(this);
  }

  async postAuthenticationHandler(req, res) {
    try {
      this._authenticationValidator.validateAuthenticationPayload(req.body);

      const { username, password } = req.body;
      const id = await this._usersService.verifyUserCrendential(username, password);

      const jwtAccessToken = this._tokenManager.generateAccessToken({ id });
      const jwtRefreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(jwtRefreshToken);

      const response = {
        status: 'berhasil',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
        },
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async putAuthenticationHandler(req, res) {
    try {
      this._authenticationValidator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

      const jwtAccessToken = this._tokenManager.generateAccessToken({ id });

      const response = {
        message: 'token berhasil diperbarui',
        data: {
          accessToken: jwtAccessToken,
        },
      };

      return res.status(201).send(response);
    } catch (e) {
      this._failedResponse(e, res);
    }
  }

  async deleteAuthenticationHandler(req, res) {
    try {
      this._authenticationValidator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      await this._tokenManager.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      const response = {
        message: 'Refresh token berhasil dihapus',
      };

      return res.status(201).send(response);
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

module.exports = AuthenticationHandler;
