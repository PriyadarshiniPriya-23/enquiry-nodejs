module.exports = (sequelize, DataTypes) => {
  const EnquiryList = sequelize.define('EnquiryList', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_enquiry_id: { type: DataTypes.INTEGER, allowNull: true },
    subject_module: { type: DataTypes.STRING(255), allowNull: true },
    training_mode: { type: DataTypes.STRING(20), allowNull: true },
    training_timing: { type: DataTypes.STRING(50), allowNull: true },
    start_time: { type: DataTypes.STRING(50), allowNull: true },
    calling1: { type: DataTypes.STRING(255), allowNull: true },
    calling2: { type: DataTypes.STRING(255), allowNull: true },
    calling3: { type: DataTypes.STRING(255), allowNull: true },
    calling4: { type: DataTypes.STRING(255), allowNull: true },
    calling5: { type: DataTypes.STRING(255), allowNull: true },
    move_to_demo: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'enquiry_lists',
    timestamps: true,
    underscored: true
  });

  EnquiryList.associate = function(models) {
    EnquiryList.belongsTo(models.StudentEnquiry, { foreignKey: 'student_enquiry_id', as: 'student_enquiry' });
  };

  return EnquiryList;
};
