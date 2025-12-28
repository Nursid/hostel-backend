const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Login = sequelize.define(
        "Login",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

            name: { type: DataTypes.STRING, allowNull: false },
            mobile: { type: DataTypes.STRING, allowNull: false },
            linked: { type: DataTypes.STRING, allowNull: false },
            phone: { type: DataTypes.INTEGER, allowNull: false },

            user_group: { type: DataTypes.STRING, allowNull: true },
            email: { type: DataTypes.STRING, allowNull: true },
            address: { type: DataTypes.TEXT, allowNull: true },

            otp: { type: DataTypes.STRING, allowNull: false },
            token: { type: DataTypes.TEXT, allowNull: true },
            app_id: { type: DataTypes.TEXT, allowNull: true },
            device_id: { type: DataTypes.STRING, allowNull: false },

            image: { type: DataTypes.TEXT, allowNull: false },
            active: { type: DataTypes.INTEGER, defaultValue: 1 },

            login: { type: DataTypes.STRING, allowNull: true },
            date: { type: DataTypes.STRING, allowNull: false },
            company: { type: DataTypes.STRING, allowNull: false },
            section: { type: DataTypes.STRING, defaultValue: "0" },
            department: { type: DataTypes.STRING, allowNull: false },

            website: { type: DataTypes.STRING, allowNull: false },
            socialid: { type: DataTypes.STRING, allowNull: false },
            facebookid: { type: DataTypes.STRING, allowNull: false },
            twitterid: { type: DataTypes.STRING, allowNull: false },
            instagramid: { type: DataTypes.STRING, allowNull: false },
            youtube: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },

            BussinessType: { type: DataTypes.STRING, allowNull: false },
            qrimage: { type: DataTypes.STRING, allowNull: false },
            firebassid: { type: DataTypes.STRING, allowNull: false },
            m_id: { type: DataTypes.STRING, allowNull: false },

            baseurl: { type: DataTypes.STRING, allowNull: false },
            Longitude: { type: DataTypes.STRING, allowNull: false },
            Latitude: { type: DataTypes.STRING, allowNull: false },
            paymentlink: { type: DataTypes.TEXT, allowNull: false },
            about_us: { type: DataTypes.TEXT, allowNull: false },

            googleprofile: { type: DataTypes.STRING, allowNull: false },
            Generated_Qr: { type: DataTypes.STRING, allowNull: true },

            ssid: { type: DataTypes.STRING, allowNull: false },
            mac: { type: DataTypes.STRING, allowNull: false },
            bluetooth_ssid: { type: DataTypes.STRING, allowNull: false },
            bluetooth_mac: { type: DataTypes.STRING, allowNull: false },

            strength: { type: DataTypes.INTEGER, allowNull: false },
            business_group: { type: DataTypes.INTEGER, allowNull: false },
            designation: { type: DataTypes.STRING, allowNull: false },

            dob: { type: DataTypes.STRING, allowNull: false },
            gender: { type: DataTypes.TINYINT, allowNull: false },
            doj: { type: DataTypes.STRING, allowNull: false },

            education: { type: DataTypes.STRING, allowNull: false },
            reference: { type: DataTypes.STRING, allowNull: false },
            emp_code: { type: DataTypes.STRING, allowNull: false },

            token_status: { type: DataTypes.TINYINT, defaultValue: 1 },
            export: { type: DataTypes.TINYINT, defaultValue: 1 },
            prime_att: { type: DataTypes.TINYINT, defaultValue: 1 },
            premium: { type: DataTypes.TINYINT, defaultValue: 0 },
            manager: { type: DataTypes.TINYINT, defaultValue: 0 },

            validity: { type: DataTypes.STRING, allowNull: false },
            blood_group: { type: DataTypes.STRING, allowNull: false },
            father_name: { type: DataTypes.STRING, allowNull: false },
            experience: { type: DataTypes.STRING, allowNull: false },

            start_date: { type: DataTypes.STRING, allowNull: false },
            bio_id: { type: DataTypes.STRING, allowNull: false },
            update_date: { type: DataTypes.STRING, allowNull: false },

            deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
        },
        {
            timestamps: false,
            tableName: "login",  // ← EXACT TABLE NAME
        }
    );

    return Login;
};
