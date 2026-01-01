module.exports = (sequelize, DataTypes) => {
    const UserRequest = sequelize.define('UserRequest', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
  
      business_id: {
        type: DataTypes.INTEGER
      },
  
      user_id: {
        type: DataTypes.INTEGER
      },
  
      doj: {
        type: DataTypes.BIGINT // joining date (unix) OR change to DATE
      },
  
      doreg: {
        type: DataTypes.BIGINT // registration date
      },
  
      employement: {
        type: DataTypes.STRING
      },
  
      left_date: {
        type: DataTypes.BIGINT
      },
  
      user_status: {
        type: DataTypes.TINYINT
      },
  
      qr: {
        type: DataTypes.TINYINT
      },
  
      gps: {
        type: DataTypes.TINYINT
      },
  
      face: {
        type: DataTypes.TINYINT
      },
  
      colleague: {
        type: DataTypes.TINYINT
      },
  
      auto_gps: {
        type: DataTypes.TINYINT
      },
  
      gps_tracking: {
        type: DataTypes.TINYINT
      },
  
      field_duty: {
        type: DataTypes.TINYINT
      },
  
      four_layer_security: {
        type: DataTypes.TINYINT
      },
  
      selfie_with_gps: {
        type: DataTypes.TINYINT
      },
  
      selfie_with_field_duty: {
        type: DataTypes.TINYINT
      },
  
      rule_id: {
        type: DataTypes.INTEGER
      },
  
      punch_mode: {
        type: DataTypes.STRING
      },
  
      hostel: {
        type: DataTypes.TINYINT
      },
  
      qr_mode: {
        type: DataTypes.STRING
      },
  
      month_weekly_off: {
        type: DataTypes.STRING
      },
  
      date: {
        type: DataTypes.BIGINT
      }
  
    }, {
      tableName: 'user_request',
      timestamps: false
    });
  
    return UserRequest;
  };
  