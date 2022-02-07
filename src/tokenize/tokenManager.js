require('dotenv').config();
const Jwt = require('jsonwebtoken');
const InvariantError = require('../error/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: 3000 }),
  generateRefreshToken: (payload) => Jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.decode(refreshToken);
      // verify signature
      Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

      const { id } = artifacts;
      return id;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
  verifyAccessToken: (accessToken) => {
    try {
      const artifacts = Jwt.decode(accessToken);
      // verify signature
      Jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

      const { id } = artifacts;
      return id;
    } catch (error) {
      throw new InvariantError('Access token tidak valid');
    }
  },
};

module.exports = TokenManager;
