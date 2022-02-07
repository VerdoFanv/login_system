exports.up = (pgm) => {
  pgm.createTable('roles', {
    user_id: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    role: {
      type: 'INT',
      notNull: true,
    },
  });

  pgm.addConstraint('roles', 'fk_roles.userId_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('roles');
};
