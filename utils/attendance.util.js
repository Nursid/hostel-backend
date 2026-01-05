exports.secondsToHrs = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor(sec / 60) % 60;
    return `${h}:${m} Hr`;
  };
  
  exports.isBetween = (date, from, to) => {
    return date >= from && date <= to;
  };
  
  exports.dayOfWeek = (unix) => {
    return new Date(unix * 1000).getDay() || 7;
  };

  exports.isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
  
    exports.expandLeaveDates = (from, to) => {
    const dates = [];
    let cur = new Date(from * 1000);
    const end = new Date(to * 1000);
    while (cur <= end) {
      dates.push(cur.toLocaleDateString("en-GB"));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  exports.toSeconds = (h, m) => h * 3600 + m * 60;

exports.formatHrs = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}:${m}`;
};

exports.groupPunches = (records) => {
  const ins = [], outs = [];
  records.forEach(r => {
    if (r.mode === "in") ins.push(r.io_time);
    if (r.mode === "out") outs.push(r.io_time);
  });
  return { ins, outs };
};

exports.calculateWorkingSeconds = (ins, outs) => {
  let sec = 0;
  for (let i = 0; i < ins.length; i++) {
    if (outs[i] && outs[i] > ins[i]) {
      sec += outs[i] - ins[i];
    }
  }
  return sec;
};

  
  