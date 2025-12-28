const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const StudentAttendance = sequelize.define(
        "StudentAttendance",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            bid: { type: DataTypes.INTEGER, allowNull: false },
            class_id: { type: DataTypes.INTEGER, allowNull: false },

            student_id: { type: DataTypes.INTEGER, allowNull: false },

            added_by: { type: DataTypes.INTEGER, allowNull: false },

            student_status: { type: DataTypes.INTEGER, allowNull: false },

            device: { type: DataTypes.STRING, allowNull: false, defaultValue: "0" },

            time: { type: DataTypes.STRING, allowNull: false },

            update_date: { type: DataTypes.STRING, allowNull: false },

            date_time: { type: DataTypes.STRING, allowNull: false },

            status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
        },
        {
            timestamps: false,
            tableName: "student_attendance",
        }
    );

    return StudentAttendance;
};
