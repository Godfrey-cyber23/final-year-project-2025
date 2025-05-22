import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import Exam from './Exam.js';
import User from './User.js';

class Report extends Model {}

Report.init({
  report_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  exam_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'exams',
      key: 'exam_id',
    },
    onDelete: 'CASCADE',
  },
  generated_by: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  report_type: {
    type: DataTypes.ENUM('security', 'performance', 'attendance'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  generated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Report',
  tableName: 'reports',
  underscored: true,
  timestamps: false, // Only using generated_at
});

// Associations
Report.belongsTo(Exam, {
  foreignKey: 'exam_id',
  onDelete: 'CASCADE',
});
Exam.hasMany(Report, {
  foreignKey: 'exam_id',
  onDelete: 'CASCADE',
});

Report.belongsTo(User, {
  foreignKey: 'generated_by',
  as: 'generatedBy',
  onDelete: 'CASCADE',
});
User.hasMany(Report, {
  foreignKey: 'generated_by',
  as: 'generatedReports',
  onDelete: 'CASCADE',
});

export default Report;
