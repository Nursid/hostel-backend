const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Subject = sequelize.define(
        "Subject",
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

            dep_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            Subject_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },

            date_time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "subject", // EXACT table name
        }
    );

    return Subject;
};
