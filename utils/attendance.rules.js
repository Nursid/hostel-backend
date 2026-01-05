exports.applyRules = ({
    workingSeconds,
    lateSeconds,
    earlySeconds,
    rules
  }) => {
    let status = "P";
    let subStatus = [];
  
    if (rules.absent_on && workingSeconds < rules.absent) {
      status = "A";
    } else if (rules.halfday_on && workingSeconds < rules.halfday) {
      status = "P/2";
    }
  
    if (rules.sl_late_on && lateSeconds > rules.sl_late) {
      subStatus.push("SL");
    }
  
    if (rules.sl_early_on && earlySeconds > rules.sl_early) {
      subStatus.push("SL");
    }
  
    return { status, subStatus };
  };
  