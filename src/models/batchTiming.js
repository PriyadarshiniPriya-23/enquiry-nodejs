// src/models/batchTiming.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BatchTiming = sequelize.define('BatchTiming', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    time_range: { type: DataTypes.STRING(50), allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'users_batch_timings',
    timestamps: false,
    underscored: true
  });

  BatchTiming.associate = function(models) {
    BatchTiming.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  };

  return BatchTiming;
};
