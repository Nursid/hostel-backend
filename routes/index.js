const express = require('express');
const router = express.Router();
const StudentController = require("../controller/AttendanceController")
const {setSession} = require("../middleware")
router.post('/students_monthly_report',setSession, StudentController.studentsMonthlyReport)
router.post('/attendance/daily',StudentController.TeacherDailyReport)
router.post('/attendance/monthly',StudentController.TeacherMonthlyReport)



module.exports = router;
