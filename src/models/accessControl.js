// src/models/accessControl.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AccessControl = sequelize.define('AccessControl', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    role: { 
      type: DataTypes.ENUM('counsellor','accounts','hr','admin'), 
      defaultValue: 'counsellor'
    }
  }, {
    tableName: 'access_control',
    timestamps: false,
    underscored: true
  });

  AccessControl.associate = function(models) {
    AccessControl.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return AccessControl;
};
