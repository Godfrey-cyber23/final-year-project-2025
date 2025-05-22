import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Program from './Program.js';

class Student extends Model {}

Student.init({
  student_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  program_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'program_id',
    },
    onDelete: 'CASCADE',
  },
  student_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students',
  underscored: true,
  timestamps: true,
});

// Associations
Student.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
User.hasOne(Student, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Student.belongsTo(Program, {
  foreignKey: 'program_id',
  onDelete: 'CASCADE',
});
Program.hasMany(Student, {
  foreignKey: 'program_id',
  onDelete: 'CASCADE',
});

export default Student;
