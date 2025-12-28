const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Student = sequelize.define(
        "Student",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            enroll_id: { type: DataTypes.STRING, allowNull: false },
            bid: { type: DataTypes.INTEGER, allowNull: false },
            class_id: { type: DataTypes.INTEGER, allowNull: false },

            department: { type: DataTypes.STRING, allowNull: false },
            session: { type: DataTypes.STRING, allowNull: false, defaultValue: "0" },
            semester: { type: DataTypes.STRING, allowNull: false },
            batch: { type: DataTypes.STRING, allowNull: false },

            section: { type: DataTypes.STRING, allowNull: false, defaultValue: "0" },

            email: { type: DataTypes.STRING, allowNull: false },
            name: { type: DataTypes.STRING, allowNull: false },
            roll_no: { type: DataTypes.STRING, allowNull: false },
            student_code: { type: DataTypes.STRING, allowNull: false },

            image: { type: DataTypes.STRING, allowNull: false },

            dob: { type: DataTypes.STRING, allowNull: false },
            gender: { type: DataTypes.STRING, allowNull: false },
            blood_group: { type: DataTypes.STRING, allowNull: false },

            address: { type: DataTypes.STRING, allowNull: false },

            parent_name: { type: DataTypes.STRING, allowNull: false },
            parent_relation: { type: DataTypes.STRING, allowNull: false },
            parent_mobile: { type: DataTypes.STRING, allowNull: false },

            doj: { type: DataTypes.STRING, allowNull: false },
            left_date: { type: DataTypes.STRING, allowNull: false },

            bio_id: { type: DataTypes.STRING, allowNull: false },
            rfid: { type: DataTypes.STRING, allowNull: false },

            update_date: { type: DataTypes.STRING, allowNull: false },
            date_time: { type: DataTypes.STRING, allowNull: false },

            status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
            is_passout: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },

            passout_year: { type: DataTypes.STRING, allowNull: false },
            passout_date: { type: DataTypes.DATE, allowNull: true },
        },
        {
            timestamps: false,
            tableName: "student", // EXACT table name
        }
    );

    return Student;
};
