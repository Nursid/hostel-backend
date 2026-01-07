const repo = require("../repositories/monthlyattendance.repo");
const utils = require("../utils/attendance.util");
const rulesEngine = require("../utils/attendance.rules");
const {ACTION_CONFIG} = require("../utils")
const DAY = 86400;

/* ================= HELPERS ================= */

const dateKey = ts =>
  new Date(ts * 1000).toISOString().slice(0, 10);

const getDayName = ts =>
  new Date(ts * 1000).toLocaleString("en-US", { weekday: "long" });

const isWeekOff = (ts, weeklyOffArr = []) => {
  const jsDay = new Date(ts * 1000).getDay(); // 0 Sun
  const phpDay = jsDay === 0 ? 6 : jsDay - 1; // PHP Mon=0
  return weeklyOffArr[phpDay] === "1";
};

const formatHrs = sec => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} Hr`;
};


const generateDaysHeader = (start, end) => {
  const daysweek = [];
  const days = [];

  for (let d = start; d <= end; d += DAY) {
    const dateObj = new Date(d * 1000);

    const dd = String(dateObj.getDate()).padStart(2, "0");
    const day = dateObj.toLocaleString("en-US", { weekday: "short" });

    daysweek.push(`${dd} ${day}`);
    days.push(dd);
  }

  return { daysweek, days };
};


/* ================= SERVICE ================= */

exports.generateMonthlyReport = async ({
  companyId,
  start_date,
  end_date,
  department,
  section,
  action,
}) => {

  const start = Math.floor(new Date(`${start_date} 00:00:00`).getTime() / 1000);
  const end   = Math.floor(new Date(`${end_date} 23:59:59`).getTime() / 1000);

  const { daysweek, days } = generateDaysHeader(start, end);
  /* 🔥 BULK DB CALLS (FAST) */
  const [
    login,
    users,
    punches,
    leaves,
    holidays,
    rules
  ] = await Promise.all([
    repo.getLoginUser(companyId),
    repo.getUsers(companyId),
    repo.getAttendance(start, end, companyId),
    repo.getLeaves(start, end, companyId),
    repo.getHolidays(companyId),
    repo.getRules(companyId)
  ]);

  /* ================= INDEX DATA ================= */


  const punchMap = new Map();

    punches.forEach(p => {
      p.time = p.io_time;   // 👈 FIX HERE

      const userId = p.user_id;

      if (!punchMap.has(userId)) {
        punchMap.set(userId, []);
      }

      punchMap.get(userId).push(p);
    });


  const leaveMap = new Map();
  leaves.forEach(l => {
    if (!leaveMap.has(l.uid)) leaveMap.set(l.uid, new Set());
    leaveMap.get(l.uid).add(dateKey(l.from_date));
  });

  const holidaySet = new Set(holidays.map(h => dateKey(h.date)));
  const ruleMap = new Map(rules.map(r => [r.rule_id, r]));

  /* ================= MAIN LOGIC ================= */
  const report = users.map(user => {

    const weeklyOffArr = user?.Login?.BusinessGroup?.weekly_off?.split(",") || [];
    const rule = ruleMap.get(user.rule_id);

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalWeekOff = 0;
    let totalHoliday = 0;
    let totalLeaves = 0;
    let totalOD = 0;
    let totalWFH = 0;
    let totalP2 = 0;
    let totalOT = 0;
    let totalWorkingSeconds = 0;

    const days = [];

    for (let d = start; d <= end; d += DAY) {

      const dk = dateKey(d);
      // const punchesOfDay = punchMap.get(user.user_id) || [];

      const allPunches = punchMap.get(user.user_id) || [];

        const dayStart = d;
        const dayEnd = d + DAY;

        const punchesOfDay = allPunches.filter(p =>
          p.io_time >= dayStart && p.io_time < dayEnd
        );

      const weekOff = isWeekOff(d, weeklyOffArr);
      const holiday = holidaySet.has(dk);
      const leave = leaveMap.get(user.user_id)?.has(dk);

      let dayStatus = "A";

      if (!punchesOfDay.length) {

        if (weekOff) {
          totalWeekOff++;
          dayStatus = "W";
        } else if (holiday) {
          totalHoliday++;
          dayStatus = "H";
        } else if (leave) {
          totalLeaves++;
          dayStatus = "L";
        } else {
          totalAbsent++;
        }

        days.push({
          date: new Date(d * 1000).getDate(),
          day: getDayName(d),
          weekly_off: weekOff ? 1 : 0,
          holiday: holiday ? 1 : 0,
          leave: leave ? 1 : 0,
          onduty: 0,
          wfhduty: 0,
          data: [],
          workingHrs: "W.H 00:00 Hr",
          late_hrs: "00:00",
          early_hrs: "00:00",
          ot_hrs: "00:00",
          day_status: dayStatus,
          day_sub_status: "",
          sl: "s"
        });
        continue;
      }

      const sec = utils.calculateWorkingSeconds(punchesOfDay);


      totalWorkingSeconds += sec;

      const r = rulesEngine.applyRules({
        workingSeconds: sec,
        lateSeconds: 0,
        earlySeconds: 0,
        rules: rule
      });

      if (weekOff) {
        totalWeekOff++;
        totalOT++;
        dayStatus = "W";
      } else if (holiday) {
        totalHoliday++;
        totalOT++;
        dayStatus = "H";
      } else if (r.status === "P") {
        totalPresent++;
        dayStatus = "P";
      } else if (r.status === "P/2") {
        totalP2++;
        dayStatus = "P/2";
      } else {
        totalAbsent++;
      }

      days.push({
        date: new Date(d * 1000).getDate(),
        day: getDayName(d),
        weekly_off: weekOff ? 1 : 0,
        holiday: holiday ? 1 : 0,
        leave: leave ? 1 : 0,
        onduty: 0,
        wfhduty: 0,
        data: punchesOfDay,
        workingHrs: `W.H ${formatHrs(sec)}`,
        late_hrs: "00:00",
        early_hrs: "00:00",
        ot_hrs: "00:00",
        day_status: dayStatus,
        day_sub_status: "",
        sl: "s"
      });
    }

    const nwd =
      totalPresent +
      totalWeekOff +
      totalHoliday +
      totalLeaves +
      totalOD +
      totalWFH +
      totalP2 / 2;

    return {
      shift_start: user.Login?.BusinessGroup?.shift_start || "",
      shift_end: user.Login?.BusinessGroup?.shift_end || "",
      group_name: user.Login?.BusinessGroup?.name || "",
      designation: user.Login?.designation || "",
      mid: user.Login?.m_id || "",
      emp_code: user.Login?.emp_code || "",
      name: user.Login?.name || "",
      image: user.Login?.image || "",
      user_id: user.user_id,
      totalAbsent,
      totalPresent: totalPresent + totalOD + totalWFH,
      totalWeekOff,
      totalHoliday,
      totalLeaves,
      totalOD,
      totalShortLeave: 0,
      totalWorkingHrs: formatHrs(totalWorkingSeconds),
      totalLate: "00:00 Hr",
      totalEarly: "00:00 Hr",
      totalP2,
      totalOT,
      nwd,
      data: days
    };
  });

  const uiFlags = ACTION_CONFIG[action] || ACTION_CONFIG[1];

  return {
    start_date,
    end_date,
    load: 1,
    report,
    cmp_name: login?.name,
    daysweek,
    days,
    uiFlags
  };
};
