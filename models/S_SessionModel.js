const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const S_Session = sequelize.define(
        "S_Session",
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

            dep_id: {
                type: DataTypes.STRING,  // VARCHAR(255)
                allowNull: false,
            },

            session_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            date_time: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            timestamps: false,
            tableName: "S_Session",
        }
    );

    return S_Session;
};
