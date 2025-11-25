// src/models/course.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'users_course',
    timestamps: true,
    underscored: true
  });

  Course.associate = function(models) {
    Course.hasMany(models.BatchTiming, { foreignKey: 'courseId', as: 'batch_timings' });
  };

  return Course;
};
