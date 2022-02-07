const { Pool } = require('pg');
const InvariantError = require('../../error/InvariantError');
const NotFoundError = require('../../error/NotFoundError');

class RolesService {
  constructor() {
    this._pool = new Pool();
  }

  async addAdminRole(userId) {
    await this._verifyExistRole(userId);
    const query = {
      text: 'INSERT INTO roles VALUES ($1, $2)',
      values: [userId, 1],
    };

    await this._pool.query(query);
  }

  async addUserRole(userId) {
    await this._verifyExistRole(userId);
    const query = {
      text: 'INSERT INTO roles VALUES ($1, $2)',
      values: [userId, 2],
    };

    await this._pool.query(query);
  }

  async getRoleByUserId(userId) {
    const query = {
      text: 'SELECT * FROM roles WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('UserId tidak ditemukan');
    }

    return result.rows[0];
  }

  async editRoleToAdminByUserId(userId) {
    const query = {
      text: 'UPDATE roles SET role = $1 WHERE user_id = $2',
      values: [1, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengubah role, userId tidak ditemukan');
    }
  }

  async editRoleToUserByUserId(userId) {
    const query = {
      text: 'UPDATE roles SET role = $1 WHERE user_id = $2',
      values: [2, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengubah role, userId tidak ditemukan');
    }
  }

  async deleteRoleByUserId(userId) {
    const query = {
      text: 'DELETE FROM roles WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus role, userId tidak ditemukan');
    }
  }

  async _verifyExistRole(userId) {
    const query = {
      text: 'SELECT * FROM roles WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Gagal menambahkan role baru, role sudah ditetapkan');
    }
  }
}

module.exports = RolesService;
