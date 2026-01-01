module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      bussiness_id: {
        type: DataTypes.INTEGER
      },
  
      user_id: {
        type: DataTypes.INTEGER
      },
  
      mode: {
        type: DataTypes.STRING
      },
  
      comment: {
        type: DataTypes.TEXT
      },
  
      emp_comment: {
        type: DataTypes.TEXT
      },
  
      manual: {
        type: DataTypes.TINYINT
      },
  
      latitude: {
        type: DataTypes.DECIMAL(10, 7)
      },
  
      longitude: {
        type: DataTypes.DECIMAL(10, 7)
      },
  
      location: {
        type: DataTypes.STRING
      },
  
      io_time: {
        type: DataTypes.STRING // or TIME if only time
      },
  
      selfie: {
        type: DataTypes.STRING // image path/url
      },
  
      night: {
        type: DataTypes.TINYINT
      },
  
      date: {
        type: DataTypes.BIGINT // attendance date (unix)
      },
  
      verified: {
        type: DataTypes.TINYINT
      },
  
      hostel: {
        type: DataTypes.TINYINT
      },
  
      device: {
        type: DataTypes.STRING
      },
  
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      }
  
    }, {
      tableName: 'attendance',
      timestamps: false
    });
  
    return Attendance;
  };
  