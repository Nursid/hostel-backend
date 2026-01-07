const repo = require("../repositories/attendance.repo");
const { secondsToHrs,isSameDay, expandLeaveDates } = require("../utils/attendance.util");

exports.getDailyAttendance = async (start_date, action, shift, section, department, companyId) => {

  const {
    users = [],
    attendance = [],
    leaves = [],
    holidays = [],
    rules = [],
  } = await repo.getDailyRawData(companyId, start_date);

 
  /* ---------- INDEXING ---------- */
  const attendanceMap = {};
  attendance?.value.forEach(a => {
    if (!attendanceMap[a.user_id]) attendanceMap[a.user_id] = [];
    attendanceMap[a.user_id].push(a);
  });

  const leaveDateMap = {};
  leaves?.value?.forEach(l => {
    const dates = expandLeaveDates(l.from_date, l.to_date);
    if (!leaveDateMap[l.uid]) leaveDateMap[l.uid] = new Set();
    dates.forEach(d => leaveDateMap[l.uid].add(d));
  });
  

  const holidaySet = new Set();
  holidays?.value?.forEach(h => {
    holidaySet.add(
      new Date(h.date * 1000).toLocaleDateString("en-GB")
    );
  });
  
  
  const ruleMap = {};
  rules?.value.forEach(r => (ruleMap[r.rule_id] = r));

  const selectedDate = start_date
  ? new Date(`${start_date}T00:00:00`)
  : new Date();

  selectedDate.setHours(0, 0, 0, 0);

  const startDay = Math.floor(selectedDate.getTime() / 1000);
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');


  /* ---------- COUNTERS ---------- */
  let summary = {
    totalActive: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalMispunch: 0,
    totalHalfDay: 0,
    totalLate: 0,
    totalEarly: 0,
    totalShortLeave: 0,
    totalUnverified: 0,
    totalFieldDuty: 0,
    totalWeekOff: 0,
    totalHoliday: 0,
    totalLeaves: 0,
    totalManual: 0,
    totalGps: 0
  };
  

  const report = [];

  /* ---------- MAIN LOOP ---------- */
  for (const user of users?.value) {

    const doj = Number(user.doj || 0);
    const leftDate = Number(user.left_date || 0);

    if ((doj && startDay < doj) || (leftDate && startDay >= leftDate)) {
      continue;
    }


    const userDateStr = selectedDate.toLocaleDateString("en-GB");

    const weeklyOffDays =
      user?.Login?.BusinessGroup?.weekly_off
        ?.split(",")
        .map((v, i) => (v === "1" ? i + 1 : null))
        .filter(Boolean) || [];

    const isWeekOff = weeklyOffDays.includes(selectedDate.getDay() || 7);
    if (isWeekOff) summary.totalWeekOff++;

    const isHoliday = holidaySet.has(userDateStr);
    if (isHoliday) summary.totalHoliday++;

    const isLeave =
      leaveDateMap[user.user_id]?.has(userDateStr) || false;
    if (isLeave) summary.totalLeaves++;


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
    let fieldDuty = "0";
    let manual = "0";
    let gps = "0";
    let unverified = "0";
    
    punches
      .slice()
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
    
        if (p.manual === "2") fieldDuty = "1";
        if (p.manual === "1") manual = "1";
        if (p.location) gps = "1";
        if (p.verified === 0) unverified = "1";
      });
    
    if (fieldDuty === "1") summary.totalFieldDuty++;
    if (manual === "1") summary.totalManual++;
    if (gps === "1") summary.totalGps++;
    if (unverified === "1") summary.totalUnverified++;


    // if (rule.wh_cal === "1" && data.length > 1) {
    //   workingSeconds =
    //     data[data.length - 1].time - data[0].time;
    // } else {
    //   for (let i = 0; i < ins.length; i++) {
    //     if (outs[i] && outs[i] > ins[i]) {
    //       workingSeconds += outs[i] - ins[i];
    //     }
    //   }
    // }

    if (
      rule.halfday_on === "1" &&
      workingSeconds > 0 &&
      workingSeconds < rule.halfday
    ) {
      halfday = "1";
      summary.totalHalfDay++;
    }
    
    if (
      rule.absent_on === "1" &&
      workingSeconds > 0 &&
      workingSeconds < rule.absent
    ) {
      absent = "1";
    }
    

    const hasOut = data.some(d => d.mode === "out");
    if (rule.mispunch === "1" && data.length && !hasOut) {
      mispunch = "1";
      summary.totalMispunch++;
    }


const shiftStart = user?.Login?.BusinessGroup?.shift_start;
const shiftEnd = user?.Login?.BusinessGroup?.shift_end;

if (shiftStart && ins.length) {
  const inTime = new Date(ins[0] * 1000);
  const shStart = new Date(`${date} ${shiftStart}`);

  if (inTime > shStart) {
    lateSeconds = (inTime - shStart) / 1000;
    summary.totalLate++;

    if (
      rule.sl_late_on === "1" &&
      lateSeconds > rule.sl_late
    ) {
      sl = "SL";
      summary.totalShortLeave++;
    }
  }
}

if (shiftEnd && outs[outs.length - 1]) {
  const outTime = new Date(outs[outs.length - 1] * 1000);
  const shEnd = new Date(`${date} ${shiftEnd}`);

  if (shEnd > outTime) {
    earlySeconds = (shEnd - outTime) / 1000;
    summary.totalEarly++;

    if (
      rule.sl_early_on === "1" &&
      earlySeconds > rule.sl_early &&
      halfday === "0"
    ) {
      sl = "SL";
      summary.totalShortLeave++;
    }
  }
}

    

    /* ---------- OUTS ALIGNMENT (PHP LOGIC) ---------- */
    // while (outs.length < ins.length) {
    //   outs.push(0);
    // }

    // /* ---------- WORKING HOURS ---------- */
    // for (let i = 0; i < ins.length; i++) {
    //   if (outs[i] && outs[i] > ins[i]) {
    //     workingSeconds += outs[i] - ins[i];
    //   }
    // }

let lastInTime = null;

// data array already bana hua hai (mode + time)
const punchesSorted = data
  .slice()
  .sort((a, b) => a.time - b.time);

for (const p of punchesSorted) {
  if (p.mode === "in") {
    lastInTime = p.time;
  }

  if (p.mode === "out" && lastInTime !== null) {
    if (p.time > lastInTime) {
      workingSeconds += (p.time - lastInTime);
    }
    lastInTime = null; // IN–OUT pair complete
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
      sl,
      weekly_off: isWeekOff ? "1" : "0",
      holiday: isHoliday ? "1" : "0",
      leave: isLeave ? "1" : "0",
      fieldDuty,
      manual,
      gps,
      unverified,
    });
  }



  return {
    start_date: selectedDateStr,
    load: 1,
    report,
    summary
  };
};
