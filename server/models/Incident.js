import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import MonitoringLog from './MonitoringLog.js';
import User from './User.js';

class Incident extends Model {}
Incident.init({
  incident_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  log_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  resolved_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  status: { type: DataTypes.ENUM('reported','investigating','resolved'), defaultValue: 'reported' },
  resolution_details: { type: DataTypes.TEXT, allowNull: true }
}, {
  sequelize,
  modelName: 'Incident',
  tableName: 'incidents',
  underscored: true,
  timestamps: true
});

Incident.belongsTo(MonitoringLog, { foreignKey: 'log_id', as: 'log' });
MonitoringLog.hasMany(Incident, { foreignKey: 'log_id' });
Incident.belongsTo(User, { foreignKey: 'resolved_by' });
User.hasMany(Incident, { foreignKey: 'resolved_by' });

export default Incident;