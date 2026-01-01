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
  