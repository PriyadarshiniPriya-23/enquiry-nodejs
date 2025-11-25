module.exports = (sequelize, DataTypes) => {
  const StudentEnquiry = sequelize.define('StudentEnquiry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    phone_number: { type: DataTypes.STRING(10), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    current_location: { type: DataTypes.STRING(255), allowNull: true },
    current_address: { type: DataTypes.STRING(255), allowNull: true },
    course_enquiry: { type: DataTypes.STRING(255), allowNull: true },
    training_mode: { type: DataTypes.STRING(20), allowNull: true },
    training_timing: { type: DataTypes.STRING(50), allowNull: true },
    start_time: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'Immediate' },
    professional_situation: { type: DataTypes.STRING(100), allowNull: true },
    qualification: { type: DataTypes.STRING(50), allowNull: true },
    experience: { type: DataTypes.STRING(50), allowNull: true },
    referral_source: { type: DataTypes.STRING(100), allowNull: true },
    consent_to_contact: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'student_enquiries',
    timestamps: true,
    underscored: true
  });

  StudentEnquiry.associate = function(models) {
    StudentEnquiry.hasMany(models.EnquiryList, { foreignKey: 'student_enquiry_id', as: 'enquiry_list' });
    StudentEnquiry.hasMany(models.DemoList, { foreignKey: 'student_enquiry_id', as: 'demo_list' });
  };

  return StudentEnquiry;
};
