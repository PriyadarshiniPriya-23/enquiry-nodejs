// src/models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },

    // Password
    password_hash: { type: DataTypes.STRING, allowNull: false },

    // Replace full_name
    firstname: { type: DataTypes.STRING(100), allowNull: true },
    lastname: { type: DataTypes.STRING(100), allowNull: true },

    // Permissions / Flags
    is_superuser: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_staff: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },

  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });

  User.associate = function(models) {
    User.hasOne(models.AccessControl, { foreignKey: 'userId', as: 'accessControl' });
    User.hasMany(models.Enquiry, { foreignKey: 'userId', as: 'enquiries' });
  };

  return User;
};
