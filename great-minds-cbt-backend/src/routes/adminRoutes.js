const express = require('express');
const { loginAdmin, generateCbtPassword, getAllExams, createExam, deleteExam } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/students/password', adminAuth, generateCbtPassword);
router.get('/exams', adminAuth, getAllExams);
router.post('/exams', adminAuth, createExam);
router.delete('/exams/:examId', adminAuth, deleteExam);

module.exports = router;