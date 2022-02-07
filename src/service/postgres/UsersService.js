const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const moment = require('moment');
const InvariantError = require('../../error/InvariantError');
const AuthenticationError = require('../../error/AuthenticationError');
const NotFoundError = require('../../error/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password }) {
    await this._verifyExistUser(username);

    const id = `user-${nanoid(12)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = `${moment({}).utcOffset(7)}`;
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $4) RETURNING id',
      values: [id, username, hashedPassword, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new Error('User baru gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getUsers() {
    const query = 'SELECT id, username from users';
    const result = await this._pool.query(query);

    return result.rows;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username from users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mendapatakan user, id tidak ditemukan');
    }

    return result.rows[0];
  }

  async editUserById(id, { username, password }) {
    const query = {
      text: 'UPDATE users SET username = $1, password = $2 WHERE id = $3',
      values: [username, password, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengedit user, id tidak ditemukan');
    }
  }

  async deleteUserById(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus user, id tidak ditemukan');
    }
  }

  async _verifyExistUser(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Gagal menambahkan User baru, Username sudah ada');
    }
  }

  async verifyExistUserById(id) {
    const query = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('userId tidak ditemukan');
    }
  }

  async verifyUserCrendential(username, password) {
    if (username === '' && password === '') {
      throw new InvariantError('Username & Password tidak diisi');
    }

    const query = {
      text: 'SELECT id, username, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Username salah!');
    }

    const {
      id, password: hashedPassword,
    } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password salah!');
    }

    return id;
  }
}

module.exports = UsersService;
