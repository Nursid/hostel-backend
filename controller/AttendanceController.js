const dayjs = require("dayjs");
const db = require("../models")
const Login = db.Login
const Student = db.Student
const Subject = db.Subject
const StudentAttendance = db.StudentAttendance
const DepartmentSection = db.DepartmentSection
const S_Session = db.S_Session
const S_Semester = db.S_Semester
const S_section = db.S_section

// const studentsMonthlyReport = async (req, res) => {
//     try {
//         if (!req.session || !req.session.id) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const {
//             start_date = dayjs().format("YYYY-MM-DD"),
//             end_date = dayjs().format("YYYY-MM-DD"),
//             dept = 0,
//             session = 0,
//             section = 0,
//             semester = 0,
//             subject = 0
//         } = req.body;

//         let loginId = req.session.type === "P"
//             ? req.session.empCompany
//             : req.session.login_id;

//         const cmpName = await Login.findOne({ where: { id: loginId } });

//         // ============= GET STUDENT LIST =============
//         const users = await Student.findAll({
//             where: {
//                 bid: loginId,
//                 department: dept,
//                 batch: session,
//                 semester: semester,
//                 left_date: "",
//                 status: 1
//             },
//             order: [["roll_no", "ASC"]]
//         });

//         const startTime = dayjs(start_date).startOf("day").valueOf();
//         const endTime = dayjs(end_date).endOf("day").valueOf();

//         const allSubjects = await Subject.findAll({
//             where: { bid: loginId, status: 1 },
//             order: [["id", "DESC"]]
//         });

//         let reportArray = [];
//         let subjectWiseData = {};
//         let daysArray = [];

//         for (let user of users) {

//             // days difference
//             let diffDays = dayjs(end_date).diff(dayjs(start_date), "day") + 1;
//             if (diffDays > 31) diffDays = 31;

//             let monthStart = dayjs(start_date).startOf("day").valueOf();
//             let monthEnd = dayjs(start_date).endOf("day").add(diffDays, "day").valueOf();

//             // GET ATTENDANCE OF STUDENT
//             let attendance = await StudentAttendance.findAll({
//                 where: {
//                     student_id: user.id,
//                     bid: loginId,
//                     status: 1,
//                     time: { between: [startTime, endTime] }
//                 },
//                 order: [["time", "DESC"]]
//             });

//             // subject filter
//             if (subject > 0) {
//                 attendance = attendance.filter(a => a.subject_id == subject);
//             }

//             let monthData = [];

//             for (let d = 0; d < diffDays; d++) {

//                 let dayStart = dayjs(start_date).hour(10).add(d, "day").valueOf();
//                 let dayEnd = dayjs(start_date).endOf("day").add(d, "day").valueOf();

//                 daysArray.push(dayjs(dayStart).format("DD"));

//                 let dayAttendance = attendance.filter(
//                     a => a.time >= dayStart && a.time <= dayEnd
//                 );

//                 let data = [];

//                 if (dayAttendance.length > 0) {
//                     for (let at of dayAttendance) {

//                         data.push({
//                             time: at.time,
//                             subject_id: at.subject_id || 0,
//                             student_status: at.student_status || ""
//                         });

//                         // Track subject-wise count
//                         if (at.subject_id > 0) {
//                             const key = dayjs(dayStart).format("YYYY-MM-DD");
//                             subjectWiseData[key] = subjectWiseData[key] || {};
//                             subjectWiseData[key][at.subject_id] =
//                                 (subjectWiseData[key][at.subject_id] || 0) + 1;
//                         }
//                     }
//                 }

//                 monthData.push({
//                     date: dayjs(dayStart).format("D"),
//                     day: dayjs(dayStart).format("dddd"),
//                     data
//                 });
//             }

//             if (monthData.length > 0) {
//                 reportArray.push({
//                     user_id: user.id,
//                     name: user.name,
//                     data: monthData
//                 });
//             }
//         }

//         // --------- EXTRA INFO (BRANCH / BATCH / SEMESTER / SECTION / SUBJECT) ----------
//         let branch = await DepartmentSection.findOne({ where: { id: dept } });
//         let batch = await S_Session.findOne({ where: { id: session } });
//         let sem = await S_Semester.findOne({ where: { id: semester } });
//         let sectionData = await S_section.findOne({ where: { id: section } });

//         let subjectName = "";
//         if (subject > 0) {
//             let s = await Subject.findOne({ where: { id: subject } });
//             if (s) subjectName = s.name;
//         }

//         // FINAL RESPONSE
//         return res.json({
//             start_date,
//             end_date,
//             dept,
//             session,
//             section,
//             semester,
//             subject,
//             report: reportArray,
//             days: [...new Set(daysArray)],
//             subject_wise_data: subjectWiseData,
//             all_subjects: allSubjects,
//             branch_name: branch ? branch.name : "",
//             batch_name: batch ? batch.session_name : "",
//             semester_name: sem ? sem.semestar_name : "",
//             section_name: sectionData ? sectionData.name : "",
//             subject_name: subjectName,
//             cmp_name: cmpName ? cmpName.name : ""
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Server Error", details: err.message });
//     }
// };


// controllers/studentReport.controller.js

const { Op, fn, col, where, literal } = require("sequelize");
async function getPeriodTime(subjectId, dayNumber) {
  // find timetable entry for subject+day
  const tt = await db.TimeTable.findOne({
    where: {
      subject: subjectId,
      days: dayNumber
    }
  });
  if (!tt) return null; 
  // get period details
  const period = await db.S_Period.findByPk(tt.period);
  if (!period) return null;

  // merge relevant fields (similar to PHP select p.id, p.bid, p.name, tt.subject, tt.teacher, p.start_time, p.end_time, p.status, p.date_time)
  return {
    id: period.id,
    bid: period.bid,
    name: period.name,
    subject: tt.subject,
    teacher: tt.teacher,
    start_time: period.start_time,
    end_time: period.end_time,
    status: period.status,
    date_time: period.date_time,
    period_id: period.id,
    tt_id: tt.id
  };
}

async function getTeacherNameById(teacherId, bid) {
  if (!teacherId) return "";
  const t = await db.Login.findOne({ where: { id: teacherId, company: bid } });
  return t ? t.name : "";
}

async function getHolidayByBusinessId_new(buid, timestampSec) {
  // input timestampSec is unix seconds
  const dateStr = dayjs.unix(timestampSec).format("YYYY-MM-DD");

  // Best-effort: query holidays for business and match date converted from stored 'date' field.
  // If holiday.date is stored as unix seconds integer, this will work; if stored differently adjust accordingly.
  // We'll do a raw where clause: DATE(FROM_UNIXTIME(date)) = 'YYYY-MM-DD'
  const holiday = await db.Holiday.findOne({
    where: {
      business_id: buid,
      status: 1,
      // raw SQL fragment for date compare
      [Op.and]: db.sequelize.where(
        db.sequelize.fn("DATE", db.sequelize.fn("FROM_UNIXTIME", db.sequelize.col("date"))),
        dateStr
      )
    }
  });
  if (!holiday) return "";
  return holiday.name || "";
}

const studentsMonthlyReport = async (req, res) => {
  try {
    
    // session check (adjust names if different in your app)
    if (!req.session || !req.session.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postdata = req.body || {};
    let start_date = postdata.start_date || dayjs().format("YYYY-MM-DD");
    let end_date = postdata.end_date || dayjs().format("YYYY-MM-DD");
    const dept = postdata.dept ?? 0;
    const sessionId = postdata.session ?? 0;
    const section = postdata.section ?? 0;
    const semester = postdata.semester ?? 0;
    const subject = postdata.subject ?? 0;
    const loadFlag = 0 | 1; // not used, kept for parity

    // login id from session (same logic as PHP's P type)
    const user = req.session;

    const loginId =
      user.type === "P" ? user.empCompany : user.login_id;

    // business info
    const cmpNameRow = await db.Login.findOne({ where: { id: loginId } });

    // students list for given branch -> semester -> section
    const users = await db.Student.findAll({
      where: {
        bid: loginId,
        department: dept,
        semester: semester,
        section: section,
        left_date: "",
        status: 1
      },
      order: [["roll_no", "ASC"]]
    });

    // compute diff days
    let diffDays = dayjs(end_date).diff(dayjs(start_date), "day");
    diffDays = diffDays + 1;
    if (diffDays > 31) diffDays = 31;

    // collect period_days (only days that have periods for this subject)
    const period_days = [];
    const days_array = [];
    let sequential_index = 1;

    for (let d = 0; d < diffDays; d++) {
      const current = dayjs(start_date).add(d, "day");
      const dayNumber = current.day(); // 0 (Sunday) - 6 (Saturday) ; PHP used date('w')
      const calendar_day = current.format("DD");
      const day_name = current.format("dddd");
      const timestamp = current.startOf("day").unix(); // seconds

      const getperiodTime = await getPeriodTime(subject, dayNumber);
      if (getperiodTime) {
        const teacher_name = await getTeacherNameById(getperiodTime.teacher, loginId);
        period_days.push({
          sequential_day: sequential_index,
          original_index: d,
          calendar_day,
          day_name,
          timestamp,
          day_number: dayNumber,
          period_info: getperiodTime,
          teacher_name
        });
        days_array.push(sequential_index);
        sequential_index++;
      }
    }

    const report = [];

    // For each user, build month array based on period_days
    for (const user of users) {
      const months_array = [];

      for (const day_info of period_days) {
        const d = day_info.original_index;
        const startTimePeriodStr = day_info.period_info.start_time; // expecting 'HH:mm' or 'HH:mm:ss'
        const endTimePeriodStr = day_info.period_info.end_time;

        // build full datetime for the day + period times
        const dateForDay = dayjs(start_date).add(d, "day").format("YYYY-MM-DD");

        // parse times into unix seconds
        const start_time_stamp = dayjs(`${dateForDay} ${startTimePeriodStr}`, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss"]).unix();
        const end_time_stamp = dayjs(`${dateForDay} ${endTimePeriodStr}`, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss"]).unix();

        // check holiday
        const holiday_name = await getHolidayByBusinessId_new(loginId, day_info.timestamp);
        let data = { status: "A", time: "" };

        if (holiday_name) {
          data = { status: `Holiday: ${holiday_name}`, time: "" };
        } else {
          // get attendance records between start_time_stamp and end_time_stamp for this student
          const dayUserAt = await db.StudentAttendance.findAll({
            where: {
              status: 1,
              time: { [Op.between]: [start_time_stamp, end_time_stamp] },
              student_id: user.id,
              bid: loginId
            },
            order: [["time", "DESC"]]
          });

          if (dayUserAt && dayUserAt.length > 0) {
            data = {
              status: "P",
              time: dayjs.unix(Number(dayUserAt[0].time)).format("HH:mm")
            };
          } else {
            data = { status: "A", time: "" };
          }
        } // holiday else

        months_array.push({
          date: day_info.sequential_day,
          calendar_day: day_info.calendar_day,
          day: day_info.day_name,
          teacher_name: day_info.teacher_name,
          data
        });
      } // for period_days

      if (months_array.length > 0) {
        report.push({
          user_id: user.id,
          name: user.name,
          data: months_array
        });
      }
    } // for users

    // branch/batch/semester/section/subject lookups
    const branch_info = await db.DepartmentSection.findOne({ where: { id: dept } });
    const batch_info = await db.S_Session.findOne({ where: { id: sessionId } });
    const semester_info = await db.S_Semester.findOne({ where: { id: semester } });
    const section_info = await db.S_section.findOne({ where: { id: section } });

    let subject_name = "";
    if (subject > 0) {
      const s = await db.Subject.findOne({ where: { id: subject } });
      subject_name = s ? s.name : "";
    }

    const response = {
      start_date,
      end_date,
      dept,
      session: sessionId,
      section,
      semester,
      subject,
      load: 1,
      report,
      days: days_array,
      period_days,
      branch_name: branch_info ? branch_info.name : "",
      batch_name: batch_info ? batch_info.session_name : "",
      semester_name: semester_info ? semester_info.semestar_name : "",
      section_name: section_info ? section_info.name : "",
      subject_name,
      cmp_name: cmpNameRow ? cmpNameRow.name : "",
      days_with_time_periods: period_days.length
    };

    // If you want to render a view instead of returning JSON:
    // return res.render('student/students_monthly_report', response);

    return res.json(response);
  } catch (err) {
    console.error("studentsMonthlyReportNew error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};


module.exports = { studentsMonthlyReport }
