const express = require('express');
const router = express.Router();
const { getExamsByClass, getExamById, submitCbtResult } = require('../controllers/examController');
const verifyStudentToken = require('../middleware/auth');

router.get('/:className', verifyStudentToken, getExamsByClass);
router.get('/id/:examId', verifyStudentToken, getExamById);
router.post('/submit-result', verifyStudentToken, submitCbtResult);

module.exports = router;
