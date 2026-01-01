module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define('Leave', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      bid: {
        type: DataTypes.INTEGER
      },
  
      uid: {
        type: DataTypes.INTEGER
      },
  
      from_date: {
        type: DataTypes.BIGINT // or DATE if stored as date
      },
  
      to_date: {
        type: DataTypes.BIGINT // or DATE if stored as date
      },
  
      type: {
        type: DataTypes.STRING
      },
  
      reason: {
        type: DataTypes.TEXT
      },
  
      half_day: {
        type: DataTypes.TINYINT
      },
  
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
  
      date_time: {
        type: DataTypes.BIGINT // created time
      }
  
    }, {
      tableName: 'leaves',
      timestamps: false
    });
  
    return Leave;
  };
  