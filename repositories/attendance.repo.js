const { Op } = require("sequelize");
const {
  UserRequestModel,
  Attendance,
  LeavesModel,
  Holiday,
  Login,
  BusinessModel,
  AttendanceRule
} = require("../models");

const { startOfDay, endOfDay } = require("../utils/date.util");

exports.getDailyRawData = async (companyId, date) => {
  const start = startOfDay(date);
  const end = endOfDay(date);
  const [
    users,
    attendance,
    leaves,
    holidays,
    rules
  ] = await Promise.allSettled([
    UserRequestModel.findAll({
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
    }),

    Attendance.findAll({
      where: {
        bussiness_id: companyId,
        io_time: { [Op.between]: [start, end] },
        status: 1,
        manual: { [Op.ne]: "2" }
      },
      order: [["io_time", "DESC"]],
      raw: true
    }),

    LeavesModel.findAll({
      where: { bid: companyId, status: 1 },
      raw: true
    }),

    Holiday.findAll({
      where: { business_id: companyId, status: 1 },
      raw: true
    }),

    AttendanceRule.findAll({
      where: { bid: companyId },
      raw: true
    })
  ]);

  return { users, attendance, leaves, holidays, rules };
};
