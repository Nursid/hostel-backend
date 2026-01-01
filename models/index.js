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
db.BusinessModel = require('./BusinessModel')(sequelize, DataTypes);
db.EmpRoleModel = require('./EmpRoleModel')(sequelize, DataTypes);
db.LeavesModel = require('./LeavesModel')(sequelize, DataTypes);
db.SectionModel = require('./SectionModel')(sequelize, DataTypes);
db.UserRequestModel = require('./UserRequestModel')(sequelize, DataTypes);
db.Attendance = require('./Attendance')(sequelize, DataTypes);
db.AttendanceRule = require('./AttendanceRule')(sequelize, DataTypes);


// UserRequestModel ↔ Login
db.Login.hasMany(db.UserRequestModel, {
  foreignKey: 'user_id'
});

db.UserRequestModel.belongsTo(db.Login, {
  foreignKey: 'user_id'
});

// BusinessModel ↔ Login
db.BusinessModel.hasMany(db.Login, {
  foreignKey: 'business_group'
});

db.Login.belongsTo(db.BusinessModel, {
  foreignKey: 'business_group'
});


db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

module.exports = db;