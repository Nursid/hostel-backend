module.exports = (sequelize, DataTypes) => {
    const BusinessGroup = sequelize.define('BusinessGroup', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      business_id: {
        type: DataTypes.INTEGER
      },
  
      name: {
        type: DataTypes.STRING
      },
  
      shift_start: {
        type: DataTypes.STRING // use TIME if stored as TIME
      },
  
      shift_end: {
        type: DataTypes.STRING // use TIME if stored as TIME
      },
  
      weekly_off: {
        type: DataTypes.STRING // e.g. "Sunday" or "0,6"
      },
  
      month_weekly_off: {
        type: DataTypes.STRING // e.g. "2nd Saturday"
      },
  
      day_start_time: {
        type: DataTypes.STRING // use TIME if applicable
      },
  
      day_end_time: {
        type: DataTypes.STRING // use TIME if applicable
      },
  
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      }
  
    }, {
      tableName: 'business_groups',
      timestamps: false
    });
  
    return BusinessGroup;
  };
  