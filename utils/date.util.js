function convertToUnix(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return Math.floor(date.getTime() / 1000); // seconds
  }

  function startOfDay(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
  }
  
  function endOfDay(dateStr) {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(23, 59, 59, 999);
    return Math.floor(date.getTime() / 1000);
  }
  


module.exports = {convertToUnix, startOfDay, endOfDay}
  