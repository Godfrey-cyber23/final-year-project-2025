 
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import Exam from './Exam.js';
import Student from './Student.js';

class MonitoringLog extends Model {}
MonitoringLog.init({
  log_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  exam_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  action_type: { type: DataTypes.ENUM('tab_switch','face_not_visible','unusual_activity','system_check'), allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true },
  severity: { type: DataTypes.ENUM('low','medium','high'), defaultValue: 'medium' }
}, {
  sequelize,
  modelName: 'MonitoringLog',
  tableName: 'monitoring_logs',
  underscored: true,
  timestamps: true,
  indexes: [{ fields: ['exam_id', 'student_id'] }]
});

MonitoringLog.belongsTo(Exam, { foreignKey: 'exam_id' });
Exam.hasMany(MonitoringLog, { foreignKey: 'exam_id' });
MonitoringLog.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(MonitoringLog, { foreignKey: 'student_id' });

export default MonitoringLog;