module.exports = (sequelize, DataTypes) => {
    const TimeTable = sequelize.define(
        "TimeTable",
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

            days: {
                type: DataTypes.INTEGER,  // 0–6 (PHP date('w'))
                allowNull: false,
            },

            period: {
                type: DataTypes.INTEGER,  // references s_period.id
                allowNull: false,
            },

            subject: {
                type: DataTypes.INTEGER, // subject id
                allowNull: false,
            },

            class_room: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            teacher: {
                type: DataTypes.INTEGER, // login table id
                allowNull: false,
            },

            timetable_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "time_table",
            timestamps: false,
        }
    );

    return TimeTable;
};
