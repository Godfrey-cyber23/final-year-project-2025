import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Exam extends Model {}

Exam.init({
  exam_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  schedule_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  schedule_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  security_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
}, {
  sequelize,
  modelName: 'Exam',
  tableName: 'exams',
  underscored: true,
  timestamps: true,
});

export default Exam;
