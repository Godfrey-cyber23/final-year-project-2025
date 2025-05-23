module.exports = (sequelize, DataTypes) => {
  const Lecturer = sequelize.define('Lecturer', {
    lecturer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'instructor', 'system'),
      allowNull: false,
      defaultValue: 'instructor',
    },
  }, {
    tableName: 'lecturers',
    timestamps: true,
    underscored: true,
  });

  Lecturer.associate = function(models) {
    Lecturer.belongsTo(models.Department, { foreignKey: 'department_id' });
  };

  return Lecturer;
};
