module.exports = (sequelize, DataTypes) => {
    const SectionModel = sequelize.define('Section', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      bid: {
        type: DataTypes.INTEGER
      },
  
      type: {
        type: DataTypes.STRING
      },
  
      name: {
        type: DataTypes.STRING
      },
  
      ssid: {
        type: DataTypes.STRING
      },
  
      mac: {
        type: DataTypes.STRING
      },
  
      strength: {
        type: DataTypes.INTEGER
      },
  
      location: {
        type: DataTypes.STRING
      },
  
      latitude: {
        type: DataTypes.DECIMAL(10, 7)
      },
  
      longitude: {
        type: DataTypes.DECIMAL(10, 7)
      },
  
      radius: {
        type: DataTypes.INTEGER
      },
  
      bluetooth_name: {
        type: DataTypes.STRING
      },
  
      bluetooth_mac: {
        type: DataTypes.STRING
      },
  
      bluetooth_strength: {
        type: DataTypes.INTEGER
      },
  
      date_time: {
        type: DataTypes.BIGINT // or DATE if stored as datetime
      },
  
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      }
  
    }, {
      tableName: 'sections',
      timestamps: false
    });
  
    return SectionModel;
  };
  