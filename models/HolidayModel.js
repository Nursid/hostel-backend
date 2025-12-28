module.exports = (sequelize, DataTypes) => {
    const Holiday = sequelize.define('Holiday', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      business_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING },
      date: { type: DataTypes.BIGINT }, // assumed unix seconds stored in 'date' column
      status: { type: DataTypes.TINYINT, defaultValue: 1 }
    }, {
      tableName: 'holiday',
      timestamps: false
    });
    return Holiday;
  };
  