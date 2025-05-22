import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';
import Exam from './Exam.js';

class StudentExam extends Model {}

StudentExam.init({
  student_exam_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  registration_status: {
    type: DataTypes.ENUM('registered', 'approved', 'denied'),
    allowNull: false,
    defaultValue: 'registered'
  }
}, {
  sequelize,
  modelName: 'StudentExam',
  tableName: 'student_exams',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'exam_id']
    }
  ]
});

// Associations
StudentExam.belongsTo(Student, { foreignKey: 'student_id', onDelete: 'CASCADE' });
Student.hasMany(StudentExam, { foreignKey: 'student_id', onDelete: 'CASCADE' });

StudentExam.belongsTo(Exam, { foreignKey: 'exam_id', onDelete: 'CASCADE' });
Exam.hasMany(StudentExam, { foreignKey: 'exam_id', onDelete: 'CASCADE' });

export default StudentExam;
