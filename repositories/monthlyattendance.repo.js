const {
  UserRequestModel,
  Attendance,
  LeavesModel,
  Holiday,
  Login,
  BusinessModel,
  AttendanceRule
} = require("../models");
const { Op } = require("sequelize");

exports.getUsers = async (companyId) => {
  return await UserRequestModel.findAll({
    where: {
      business_id: companyId
    },
    include: [
      {
        model: Login,
        include: [
          {
            model: BusinessModel
          }
        ]
      }
    ]
  })
};



exports.getAttendance = async (start, end, bid) => {
  return await Attendance.findAll({
    where: {
      io_time: {
        [Op.between]: [start, end]
      },
      bussiness_id: bid,
      verified: 1,
      manual: {
        [Op.ne]: 2
      },
      mode: {
        [Op.ne]: "Log"
      }
    },
    order: [["io_time", "DESC"]]
  });
};

// attendance.service.js
exports.getRules = async (bid) => {
  return AttendanceRule.findAll({
    where: { bid }
  });
};

exports.getLeaves = async (start, end, bid) => {
  return LeavesModel.findAll({
    attributes: ["from_date", "to_date", "half_day", "type", "status"],
    where: {
      bid: bid,
      status: 1,
      from_date: { [Op.between]: [start, end] }
    }
  });
};

exports.getHolidays = async (companyId) => {
  return await Holiday.findAll({
      where: {
        business_id: companyId,
        status: 1
      },
      raw: true
    });
  };

  exports.getLoginUser = async (companyId) => {
    return await Login.findOne({
      where: {
        id: companyId
      },
    })
  };



// exports.getOT = (uid) =>
//   db("assign_working").where({ uid, type: 1 }).whereNot({ status: 0 });
