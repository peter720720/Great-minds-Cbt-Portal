const Student = require('../models/Student');
const CbtAccess = require('../models/CbtAccess');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerStudent = async (req, res) => {
    try {
        const { studentId, fullName, email, password, academicClass } = req.body;
        
        const existing = await Student.findOne({ $or: [{ studentId }, { email }] });
        if (existing) return res.status(400).json({ message: 'Student ID or Email already registered.' });

        const hashed = await bcrypt.hash(password, 12);
        const student = new Student({ studentId, fullName, email, password: hashed, academicClass });
        await student.save();

        res.status(201).json({ message: 'Secure student portal profile established successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const sharedAccess = await CbtAccess.findOne({ key: 'shared-exam-password' });
        const isSharedPassword = sharedAccess && await bcrypt.compare(password, sharedAccess.passwordHash);
        let student = await Student.findOne({ studentId });

        if (!student && isSharedPassword) {
            const portalEmail = `portal-${studentId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@cbt.local`;
            student = await Student.create({
                studentId,
                email: portalEmail,
                password: await bcrypt.hash(password, 12),
                academicClass: 'All Students'
            });
        }
        if (!student) return res.status(404).json({ message: 'Invalid Student ID or CBT password.' });

        const isMatch = isSharedPassword || await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect secure password.' });

        const token = jwt.sign(
            { id: student._id, studentId: student.studentId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '12h' }
        );

        res.status(200).json({ 
            token, 
            student: { 
                id: student._id, 
                fullName: student.fullName, 
                studentId: student.studentId, 
                academicClass: student.academicClass, 
                email: student.email,
                profilePicture: student.profilePicture,
                feesPaid: student.feesPaid 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.paySchoolFees = async (req, res) => {
    try {
        const update = await Student.findByIdAndUpdate(req.student.id, { feesPaid: true }, { new: true });
        res.status(200).json({ message: 'School fees payment logged successfully.', student: update });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
