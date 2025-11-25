// src/models/enquiry.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Enquiry = sequelize.define('Enquiry', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    current_location: { type: DataTypes.STRING(100), allowNull: true },
    module: { type: DataTypes.STRING(100), allowNull: true },
    timing: { type: DataTypes.STRING(50), allowNull: true },
    trainingTime: { type: DataTypes.STRING(50), allowNull: true },
    startTime: { type: DataTypes.STRING(50), allowNull: true },
    profession: { type: DataTypes.STRING(100), allowNull: true },
    qualification: { type: DataTypes.STRING(100), allowNull: true },
    experience: { type: DataTypes.STRING(50), allowNull: true },
    referral: { type: DataTypes.STRING(100), allowNull: true },
    consent: { type: DataTypes.BOOLEAN, defaultValue: false },

    calling1: { type: DataTypes.STRING(50), allowNull: true },
    calling2: { type: DataTypes.STRING(50), allowNull: true },
    calling3: { type: DataTypes.STRING(50), allowNull: true },
    calling4: { type: DataTypes.STRING(50), allowNull: true },
    calling5: { type: DataTypes.STRING(50), allowNull: true },
    previous_interaction: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.STRING(50), defaultValue: 'new' },

    batch_code: { type: DataTypes.STRING(50), allowNull: true },
    batch_subject: { type: DataTypes.STRING(100), allowNull: true },
    demo_class_status: { type: DataTypes.STRING(50), allowNull: true },
    move_to_demo: { type: DataTypes.BOOLEAN, defaultValue: false },
    admin_notes: { type: DataTypes.TEXT, allowNull: true },
    move_to_acc: { type: DataTypes.BOOLEAN, defaultValue: false },

    move_to_class: { type: DataTypes.BOOLEAN, defaultValue: false },
    packageCost: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    amountPaid: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    discount: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    balanceAmount: { type: DataTypes.DECIMAL(10,2), allowNull: true },

    pay_calling1: { type: DataTypes.TEXT, allowNull: true },
    pay_calling2: { type: DataTypes.TEXT, allowNull: true },
    pay_calling3: { type: DataTypes.TEXT, allowNull: true },
    pay_calling4: { type: DataTypes.TEXT, allowNull: true },
    pay_calling5: { type: DataTypes.TEXT, allowNull: true },
    payment_status: { type: DataTypes.BOOLEAN, defaultValue: false },
    move_to_hr: { type: DataTypes.BOOLEAN, defaultValue: false },

    follow_up_note: { type: DataTypes.TEXT, allowNull: true },
    placement: { type: DataTypes.STRING(20), allowNull: true },
    data_link: { type: DataTypes.STRING(500), allowNull: true },
    data_updated: { type: DataTypes.DATEONLY, allowNull: true },
    move_to_placements: { type: DataTypes.BOOLEAN, defaultValue: false },

    placement_status: { type: DataTypes.STRING(50), allowNull: true },
    placement_notes: { type: DataTypes.TEXT, allowNull: true },
    interview_status: { type: DataTypes.STRING(50), allowNull: true },
    interview_notes: { type: DataTypes.TEXT, allowNull: true },

    // relation: userId (who created / assigned)
    userId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'enquiries',
    timestamps: true,
    underscored: true
  });

  Enquiry.associate = function(models) {
    Enquiry.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Enquiry;
};
