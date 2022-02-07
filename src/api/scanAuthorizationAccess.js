const tokenManager = require('../tokenize/tokenManager');
const RolesService = require('../service/postgres/RolesService');
const ClientError = require('../error/ClientError');

const failedResponse = (error, res) => {
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
};

const scanAuthorizationAccess = async (req, res, next) => {
  try {
    const rolesService = new RolesService();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      const response = {
        status: 401,
        message: 'Token tidak diisi...',
      };

      return res.status(401).send(response);
    }

    const id = tokenManager.verifyAccessToken(token);
    const { role } = await rolesService.getRoleByUserId(id);

    if (role > 1) {
      const response = {
        status: 403,
        message: 'Maaf, Anda tidak bisa mengakses resource ini',
      };

      return res.status(401).send(response);
    }

    next();
  } catch (e) {
    failedResponse(e, res);
  }
};

module.exports = scanAuthorizationAccess;
