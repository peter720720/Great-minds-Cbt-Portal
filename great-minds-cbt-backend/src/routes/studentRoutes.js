const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, paySchoolFees } = require('../controllers/studentController');
const verifyStudentToken = require('../middleware/auth');

router.post('/signup', registerStudent);
router.post('/login', loginStudent);
router.post('/pay-fees', verifyStudentToken, paySchoolFees);

module.exports = router;
