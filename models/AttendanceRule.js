const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AttendanceRule = sequelize.define(
    "AttendanceRule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      bid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      rule_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      mispunch: DataTypes.TINYINT,
      sl_late: DataTypes.INTEGER,
      sl_early: DataTypes.INTEGER,
      halfday: DataTypes.INTEGER,
      absent: DataTypes.INTEGER,

      overtime_shiftout: DataTypes.TINYINT,
      overtime_wh: DataTypes.TINYINT,
      wh_cal: DataTypes.TINYINT,
      wo_absent: DataTypes.TINYINT,
      overtime_shift: DataTypes.TINYINT,

      sl_late_on: DataTypes.TINYINT,
      sl_early_on: DataTypes.TINYINT,
      halfday_on: DataTypes.TINYINT,
      absent_on: DataTypes.TINYINT,
      overtime_wh_on: DataTypes.TINYINT,

      auto_wo_on: DataTypes.TINYINT,
      auto_wo: DataTypes.INTEGER,

      lt_punchin_on: DataTypes.TINYINT,
      lt_punchin_time: DataTypes.INTEGER,

      el_punchout_on: DataTypes.TINYINT,
      el_punchout_time: DataTypes.INTEGER,
      el_punchout: DataTypes.INTEGER,

      lt_punchin: DataTypes.INTEGER,

      sl_on: DataTypes.TINYINT,
      sl_fine: DataTypes.INTEGER,
      sl_days: DataTypes.INTEGER,

      hf_sl_on: DataTypes.TINYINT,
      hf_sl_days: DataTypes.INTEGER,

      ex_absent_fine: DataTypes.INTEGER,
      ex_absent_days: DataTypes.INTEGER,
      ex_absent_on: DataTypes.TINYINT,

      ab_leave_fine_on: DataTypes.TINYINT,
      ab_leave_fine: DataTypes.INTEGER,

      incentive_hl_on: DataTypes.TINYINT,
      incentive_hl: DataTypes.INTEGER,

      ot_on: DataTypes.TINYINT,
      ot_amount: DataTypes.INTEGER,
      ot_time: DataTypes.INTEGER,

      edw_on: DataTypes.TINYINT,
      edw_days: DataTypes.INTEGER,

      active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },

      date_time: {
        type: DataTypes.STRING, // or DATE if DB supports
        allowNull: true,
      },
    },
    {
      tableName: "attendance_rule",
      timestamps: false,
    }
  );

  return AttendanceRule;
};
