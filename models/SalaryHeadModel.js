const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const CtcHead = sequelize.define(
        "ctc_head",
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
                type: DataTypes.STRING,  // VARCHAR(255)
                allowNull: false,
            },

            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            date_time: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            active: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            timestamps: false,
            tableName: "ctc_head",
        }
    );

    return CtcHead;
};
