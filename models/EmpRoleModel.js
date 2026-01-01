module.exports = (sequelize, DataTypes) => {
    const EmpRole = sequelize.define('Emp_role', {
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
  
      employee_list: {
        type: DataTypes.TINYINT
      },
  
      add_emp: {
        type: DataTypes.TINYINT
      },
  
      att_option: {
        type: DataTypes.TINYINT
      },
  
      manual_att: {
        type: DataTypes.TINYINT
      },
  
      pending_att: {
        type: DataTypes.TINYINT
      },
  
      daily_report: {
        type: DataTypes.TINYINT
      },
  
      other_report: {
        type: DataTypes.TINYINT
      },
  
      gps_report: {
        type: DataTypes.TINYINT
      },
  
      log_report: {
        type: DataTypes.TINYINT
      },
  
      att_setting: {
        type: DataTypes.TINYINT
      },
  
      leave_manage: {
        type: DataTypes.TINYINT
      },
  
      salary: {
        type: DataTypes.TINYINT
      },
  
      assign: {
        type: DataTypes.TINYINT
      },
  
      manager_role: {
        type: DataTypes.TINYINT
      },
  
      employee_login: {
        type: DataTypes.TINYINT
      },
  
      activity: {
        type: DataTypes.TINYINT
      },
  
      add_leave: {
        type: DataTypes.TINYINT
      },
  
      add_salary: {
        type: DataTypes.TINYINT
      },
  
      earn: {
        type: DataTypes.TINYINT
      },
  
      add_earn: {
        type: DataTypes.TINYINT
      },
  
      type: {
        type: DataTypes.STRING
      },
  
      department: {
        type: DataTypes.INTEGER
      },
  
      section: {
        type: DataTypes.INTEGER
      },
  
      team: {
        type: DataTypes.INTEGER
      },
  
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      },
  
      deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
  
    }, {
      tableName: 'emp_role',
      timestamps: false
    });
  
    return EmpRole;
  };
  