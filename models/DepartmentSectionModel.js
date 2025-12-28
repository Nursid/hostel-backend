const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const DepartmentSection = sequelize.define(
        "DepartmentSection",
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

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            date_time: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            status: {
                type: DataTypes.TINYINT,
                defaultValue: 1,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "department_section",
        }
    );

    return DepartmentSection;
};
