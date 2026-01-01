const repo = require("../repositories/attendance.repo");
const { secondsToHrs } = require("../utils/attendance.util");

exports.getDailyAttendance = async (companyId, filters) => {
  const { date } = filters;

  const {
    users = [],
    attendance = [],
    leaves = [],
    holidays = [],
    rules = []
  } = await repo.getDailyRawData(companyId, date);

 
  /* ---------- INDEXING ---------- */
  const attendanceMap = {};
  attendance?.value.forEach(a => {
    if (!attendanceMap[a.user_id]) attendanceMap[a.user_id] = [];
    attendanceMap[a.user_id].push(a);
  });

  const leaveMap = {};
  leaves?.value.forEach(l => {
    if (!leaveMap[l.uid]) leaveMap[l.uid] = [];
    leaveMap[l.uid].push(l);
  });

  const holidaySet = new Set(
    holidays?.value.map(h => new Date(h.date * 1000).toDateString())
  );

  const ruleMap = {};
  rules?.value.forEach(r => (ruleMap[r.rule_id] = r));

  const selectedDate = date
  ? new Date(`${date}T00:00:00`)
  : new Date();

  selectedDate.setHours(0, 0, 0, 0);

  const startDay = Math.floor(selectedDate.getTime() / 1000);


  /* ---------- COUNTERS ---------- */
  let summary = {
    totalActive: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalMispunch: 0,
    totalHalfDay: 0,
    totalLate: 0,
    totalEarly: 0,
    totalShortLeave: 0
  };

  const report = [];

  /* ---------- MAIN LOOP ---------- */
  for (const user of users?.value) {

    const doj = Number(user.doj || 0);
    const leftDate = Number(user.left_date || 0);

    if ((doj && startDay < doj) || (leftDate && startDay >= leftDate)) {
      continue;
    }

    summary.totalActive++;

    const punches = attendanceMap[user.user_id] || [];
    const rule = ruleMap[user.rule_id] || {};

    let data = [];
    let ins = [];
    let outs = [];

    let workingSeconds = 0;
    let lateSeconds = 0;
    let earlySeconds = 0;
    let otSeconds = 0;

    let mispunch = "0";
    let sl = "s";
    let halfday = "0";
    let absent = "0";

    /* ---------- ATTENDANCE LOOP (PHP SAME) ---------- */
    punches
      .slice()            // 👈 important (no mutation)
      .reverse()
      .forEach(p => {
        data.push({
          mode: p.mode,
          time: p.io_time,
          comment: `${p.comment || ""}\n${p.emp_comment || ""}`,
          manual: p.manual,
          location: p.location
        });

        if (p.mode === "in") ins.push(p.io_time);
        if (p.mode === "out") outs.push(p.io_time);
      });

    /* ---------- OUTS ALIGNMENT (PHP LOGIC) ---------- */
    while (outs.length < ins.length) {
      outs.push(0);
    }

    /* ---------- WORKING HOURS ---------- */
    for (let i = 0; i < ins.length; i++) {
      if (outs[i] && outs[i] > ins[i]) {
        workingSeconds += outs[i] - ins[i];
      }
    }

    const workingHrs = secondsToHrs(workingSeconds);

    /* ---------- PRESENT / ABSENT ---------- */
    if (data.length === 0) {
      summary.totalAbsent++;
      absent = "1";
    } else {
      summary.totalPresent++;
    }

    /* ---------- FINAL PUSH (PHP SHAPE) ---------- */
    report.push({
      user_id: user.user_id,
      mid: user?.Login?.m_id || "",
      emp_code: user?.Login?.emp_code || "",
      name: user?.Login?.name || "",
      image: user?.Login.image || "",
      user_status: user.user_status ?? 0,
      shift_start: user?.Login?.BusinessGroup?.shift_start || "",
      shift_end:  user?.Login?.BusinessGroup?.shift_end || "",
      group_name: user?.Login?.BusinessGroup?.name || "",
      designation:  user?.Login?.designation || "",
      weekly_off: "0",
      holiday: "0",
      leave: "0",
      data,
      workingHrs,
      late_hrs: secondsToHrs(lateSeconds),
      early_hrs: secondsToHrs(earlySeconds),
      ot_hrs: secondsToHrs(otSeconds),
      mispunch,
      sl_late: rule.sl_late || 0,
      sl_early: rule.sl_early || 0,
      halfday,
      absent,
      overtime_shiftout: rule.overtime_shiftout || 0,
      overtime_wh: rule.overtime_wh || 0,
      wh_cal: rule.wh_cal || 0,
      wo_absent: rule.wo_absent || 0,
      overtime_shift: rule.overtime_shift || 0,
      sl
    });
  }

  return {
    start_date: date,
    load: 1,
    report,
    summary
  };
};
