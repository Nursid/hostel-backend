// const XLSX = require("xlsx");
// const db = require('../models')
// const SalaryHeadModel = db.CtcHead
// const SalaryBasicModel = db.SalaryBasic
// const SalaryModel = db.Salary

// const createSallary = async (req, res) => {
//   const transaction = await db.sequelize.transaction();

//   try {

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     const business_id = req.body.companyId;

//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const rows = XLSX.utils.sheet_to_json(worksheet);

//     if (!rows.length) throw new Error("Excel is empty");

//     // 🔹 1. Get Active Salary Heads (ONE QUERY)
//     const heads = await SalaryHeadModel.findAll({
//       where: { bid: business_id, active: 1 },
//       attributes: ['id', 'name', 'type'],
//       raw: true
//     });


//     const headMap = {};
//     heads.forEach(h => {
//       headMap[h.name.toUpperCase()] = {
//         id: h.id,
//         type: h.type
//       };
//     });

//     // 🔹 2. Extract all userIds + dates
//     const salaryKeys = rows.map(r => ({
//       uid: r["User ID"],
//       date: new Date(r["Date (YYYY-MM)"] + "-01")
//     })).filter(r => r.uid && r.date);

//     // 🔹 3. Fetch existing salaries in ONE QUERY
//     const existingSalaries = await SalaryModel.findAll({
//       where: {
//         bid: business_id
//       },
//       attributes: ['id', 'uid', 'date'],
//       raw: true
//     });

    
   
//     const salaryMap = {};

//     existingSalaries.forEach(s => {
//       const d = new Date(s.date);   // ✅ convert first
    
//       const key = `${s.uid}_${d.getFullYear()}_${d.getMonth() + 1}`;
    
//       salaryMap[key] = s.id;
//     });

  
//     const salaryBulk = [];
//     const salaryBasicBulk = [];

//     // 🔹 4. Prepare BULK data (NO DB CALLS HERE)
//     for (const row of rows) {

//       const uid = row["User ID"];
//       const basic = row["Basic Salary"];
//       const dateStr = row["Date (YYYY-MM)"];

//       if (!uid || !dateStr) continue;

//       const salaryDate = new Date(dateStr + "-01");
//       const key = `${uid}_${salaryDate.getFullYear()}_${salaryDate.getMonth()+1}`;

//       salaryBulk.push({
//         bid: business_id,
//         uid,
//         basic,
//         total_ctc_amount: basic,
//         date: salaryDate,
//         _key: key
//       });

//       for (const column in row) {
//         const header = headMap[column.toUpperCase()];
//         if (!header) continue;

//         const amount = row[column];
//         if (!amount) continue;

//         salaryBasicBulk.push({
//           uid,
//           date: salaryDate,
//           header_id: header.id,
//           header_type: header.type,
//           amount
//         });
//       }
//     }

//     // 🔹 5. Bulk Create Salary
//     // const insertedSalaries = await SalaryModel.bulkCreate(salaryBulk, {
//     //   updateOnDuplicate: ['basic','total_ctc_amount','date'],
//     //   transaction
//     // });

//     // 🔹 6. Map Salary IDs
//     const allSalaries = await SalaryModel.findAll({
//       where: { bid: business_id },
//       attributes: ['id','uid','date'],
//       raw: true
//     });

//     const finalSalaryMap = {};
//       allSalaries.forEach(s => {
//         const d = new Date(s.date);   // ✅ string → date
//         const key = `${s.uid}_${d.getFullYear()}_${d.getMonth() + 1}`;
//         finalSalaryMap[key] = s.id;
//       });
//     // 🔹 7. Attach sid to salary_basic
//     const finalSalaryBasic = salaryBasicBulk.map(sb => {
//       const key = `${sb.uid}_${sb.date.getFullYear()}_${sb.date.getMonth()+1}`;
//       return {
//         sid: finalSalaryMap[key],
//         header_id: sb.header_id,
//         header_type: sb.header_type,
//         amount: sb.amount
//       };
//     });

//     // 🔹 8. Bulk Insert Salary Basic
//     await SalaryBasicModel.bulkCreate(finalSalaryBasic, {
//       updateOnDuplicate: ['amount'],
//       transaction
//     });

//     await transaction.commit();

//     return res.status(200).json({
//       success: true,
//       message: "Salary imported successfully 🚀"
//     });

//   } catch (error) {
//     await transaction.rollback();
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// module.exports = { createSallary }

const XLSX = require("xlsx");
const db = require('../models');
// const { Op } = require("sequelize");
const { Op, fn, col, where } = require("sequelize");

const SalaryHeadModel = db.CtcHead;
const SalaryBasicModel = db.SalaryBasic;
const SalaryModel = db.Salary;

const createSallary = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const business_id = req.body.companyId;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    if (!rows.length) throw new Error("Excel is empty");

    // 🔹 1. Fetch Active Salary Heads
    const heads = await SalaryHeadModel.findAll({
      where: { bid: business_id, active: 1 },
      attributes: ['id', 'name', 'type'],
      raw: true
    });


    const headMap = {};
    heads.forEach(h => {
      headMap[h.name.toUpperCase()] = {
        id: h.id,
        type: h.type
      };
    });

   
    // 🔹 2. Prepare Salary Bulk Data
    const salaryBulk = [];
    const salaryBasicBulk = [];
    const salaryKeySet = new Set();

    for (const row of rows) {
      const uid = row["User ID"];
      const basic_value = row["Basic Salary"] || 0;
      const dateStr = row["Date (YYYY-MM)"];

      if (!uid || !dateStr) continue;

      const salaryDate = new Date(dateStr + "-01");

      salaryKeySet.add(
        `${uid}_${salaryDate.getFullYear()}_${salaryDate.getMonth()}`
      );

      salaryBulk.push({
        bid: business_id,
        uid,
        basic_value,
        total_ctc_amount: basic_value,
        date: salaryDate
      });

      // Dynamic Heads
      for (const column in row) {
       
        const header = headMap[column.toUpperCase()];
       
        if (!header) continue;

        const amount = row[column];
        if (!amount) continue;

        salaryBasicBulk.push({
          uid,
          date: salaryDate,
          header_id: header.id,
          header_type: header.type,
          amount
        });
      }
    }
    

    // 🔹 3. BULK UPSERT Salary (CREATE + UPDATE)
    await SalaryModel.bulkCreate(salaryBulk, {
      updateOnDuplicate: ['basic_value', 'total_ctc_amount', 'date'],
      transaction
    });
   

    // 🔹 4. Fetch Only Required Salaries (OPTIMIZED)
    const allSalaries = await SalaryModel.findAll({
      where: {
        bid: business_id,
        [Op.or]: salaryBulk.map(s => ({
          uid: s.uid,
          date: s.date
        }))
      },
      attributes: ['id', 'uid', 'date'],
      raw: true
    });

    const salaryMap = {};
    allSalaries.forEach(s => {
      const d = new Date(s.date);
      const key = `${s.uid}_${d.getFullYear()}_${d.getMonth() + 1}`;
      salaryMap[key] = s.id;
    });

    // 🔹 5. Attach SID to SalaryBasic
    const finalSalaryBasic = salaryBasicBulk.map(sb => {
      const key = `${sb.uid}_${sb.date.getFullYear()}_${sb.date.getMonth() + 1}`;

      return {
        sid: salaryMap[key],
        header_id: sb.header_id,
        header_type: sb.header_type,
        amount: sb.amount
      };
    });

    // 🔹 6. UPSERT SalaryBasic
    await SalaryBasicModel.bulkCreate(finalSalaryBasic, {
      updateOnDuplicate: ['amount'],
      transaction
    });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Salary imported / updated successfully 🚀",
      allSalaries
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createSallary };