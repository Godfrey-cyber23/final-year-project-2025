import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Department extends Model {}

Department.init({
  department_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  faculty: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  secret_key_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Department',
  tableName: 'departments',
  underscored: true,
  timestamps: true,
});

export default Department;
