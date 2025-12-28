const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected ....");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Login = require("../models/LoginModel")(sequelize, DataTypes);
db.Student = require("../models/StudentModel")(sequelize, DataTypes);
db.Subject = require("../models/SubjectModel")(sequelize, DataTypes);
db.StudentAttendance = require("../models/StudentAttendanceModel")(sequelize, DataTypes);
db.DepartmentSection = require("../models/DepartmentSectionModel")(sequelize, DataTypes);
db.S_Session = require("../models/S_SessionModel")(sequelize, DataTypes);
db.S_Semester = require("../models/S_SemesterModel")(sequelize, DataTypes);
db.S_section = require("../models/S_sectionModel")(sequelize, DataTypes);
db.S_Period = require('./S_PeriodModel')(sequelize, DataTypes);
db.TimeTable = require('./TimeTableModel')(sequelize, DataTypes);
db.Holiday = require('./HolidayModel')(sequelize, DataTypes);


db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

module.exports = db;