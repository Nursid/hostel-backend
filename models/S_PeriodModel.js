module.exports = (sequelize, DataTypes) => {
    const S_Period = sequelize.define(
        "S_Period",
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

            subject: {
                type: DataTypes.INTEGER,
                allowNull: false, // subject id reference
            },

            start_time: {
                type: DataTypes.STRING, // stored like "10:00", "10:30:00"
                allowNull: false,
            },

            end_time: {
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
            tableName: "s_period",
            timestamps: false,
        }
    );

    return S_Period;
};
