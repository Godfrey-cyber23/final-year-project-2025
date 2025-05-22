import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import Department from './Department.js';

class Program extends Model {}

Program.init({
  program_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  department_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'department_id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  duration: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Program',
  tableName: 'programs',
  underscored: true,
  timestamps: true,
});

// Define associations
Program.belongsTo(Department, { foreignKey: 'department_id', onDelete: 'CASCADE' });
Department.hasMany(Program, { foreignKey: 'department_id', onDelete: 'CASCADE' });

export default Program;
