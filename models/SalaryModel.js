const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const SalaryModel = sequelize.define(
        "salary",
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

            uid: {
                type: DataTypes.STRING,  // VARCHAR(255)
                allowNull: false,
            },

            basic: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            total_ctc_amount: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            basic_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            allowance: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dedction: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "salary",
        }
    );

    return SalaryModel;
};
