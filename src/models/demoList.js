module.exports = (sequelize, DataTypes) => {
  const DemoList = sequelize.define('DemoList', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_enquiry_id: { type: DataTypes.INTEGER, allowNull: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    phone_number: { type: DataTypes.STRING(10), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    package_code: { type: DataTypes.STRING(20), allowNull: true },
    package: { type: DataTypes.STRING(100), allowNull: true },
    demo_class_status: { type: DataTypes.ENUM('Not yet started','In progress','Completed'), defaultValue: 'Not yet started' }
  }, {
    tableName: 'demo_lists',
    timestamps: true,
    underscored: true
  });

  DemoList.associate = function(models) {
    // ensure models.StudentEnquiry exists and is the correct key name
    DemoList.belongsTo(models.StudentEnquiry, { foreignKey: 'student_enquiry_id', as: 'student_enquiry' });
  };

  return DemoList;
};
