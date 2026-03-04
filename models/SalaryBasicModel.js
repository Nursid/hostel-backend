const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const SalaryBasicModel = sequelize.define(
        "salary_basic",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            sid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            header_id: {
                type: DataTypes.STRING,  // VARCHAR(255)
                allowNull: false,
            },

            header_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            header_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.STRING,
                allowNull: false,
            },
           
        },
        {
            timestamps: false,
            tableName: "salary_basic",
        }
    );

    return SalaryBasicModel;
};
