// models/Course.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Course extends Model {}

Course.init({
  course_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  course_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  program_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  instructor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  credit_hours: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Course',
  tableName: 'courses',
  underscored: true,
  timestamps: true,
});

export default Course;
