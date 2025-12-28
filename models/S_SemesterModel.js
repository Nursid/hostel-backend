const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const S_Semester = sequelize.define(
        "S_Semester",
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
                type: DataTypes.STRING,   // VARCHAR(255)
                allowNull: true,
            },

            semestar_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            year: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            timestamps: false,
            tableName: "S_Semester",
        }
    );

    return S_Semester;
};
