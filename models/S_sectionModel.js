const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const S_section = sequelize.define(
        "S_section",
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

            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            dep_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            session_id: {
                type: DataTypes.STRING,   // VARCHAR(11)
                allowNull: true,
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
            tableName: "S_section",
        }
    );

    return S_section;
};
