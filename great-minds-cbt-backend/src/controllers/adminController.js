const Exam = require('../models/Exam');
const CbtAccess = require('../models/CbtAccess');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const createTemporaryPassword = () => crypto.randomBytes(6).toString('base64url');

exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid administrator credentials.' });
    }

    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { email, role: 'admin' } });
};

exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: 'Unable to load examinations.' });
    }
};

exports.createExam = async (req, res) => {
    try {
        const { title, subject, targetClass, durationMinutes, questions } = req.body;
        if (!title || !subject || !targetClass || !durationMinutes || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Complete the exam details and add at least one question.' });
        }

        const validQuestions = questions.every((question) => (
            question.questionText?.trim() &&
            Array.isArray(question.options) &&
            question.options.length === 4 &&
            question.options.every((option) => option?.trim()) &&
            Number.isInteger(question.correctOptionIndex) &&
            question.correctOptionIndex >= 0 &&
            question.correctOptionIndex < 4
        ));

        if (!validQuestions) {
            return res.status(400).json({ message: 'Each question needs text, four options, and a valid correct answer.' });
        }

        const exam = await Exam.create({ title, subject, targetClass, durationMinutes, questions });
        res.status(201).json({ message: 'Examination uploaded successfully.', exam });
    } catch (err) {
        res.status(500).json({ message: 'Unable to upload examination.' });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const deleted = await Exam.findByIdAndDelete(req.params.examId);
        if (!deleted) return res.status(404).json({ message: 'Examination not found.' });
        res.json({ message: 'Examination deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Unable to delete examination.' });
    }
};

exports.generateCbtPassword = async (req, res) => {
    try {
        const cbtPassword = createTemporaryPassword();
        await CbtAccess.findOneAndUpdate(
            { key: 'shared-exam-password' },
            { key: 'shared-exam-password', passwordHash: await bcrypt.hash(cbtPassword, 12) },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json({
            message: 'Shared CBT password generated successfully.',
            password: cbtPassword,
        });
    } catch (err) {
        res.status(500).json({ message: 'Unable to create student account.' });
    }
};