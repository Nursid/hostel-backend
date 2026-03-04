const express = require('express');
const router = express.Router();

const uploadSalary = require('./uploadSalary');
const StudentController = require("../controller/AttendanceController")
const {setSession} = require("../middleware")
router.post('/students_monthly_report',setSession, StudentController.studentsMonthlyReport)
router.post('/attendance/daily',setSession, StudentController.TeacherDailyReport)
router.post('/attendance/monthly',setSession, StudentController.TeacherMonthlyReport)
router.use('/salary', uploadSalary);

module.exports = router;
