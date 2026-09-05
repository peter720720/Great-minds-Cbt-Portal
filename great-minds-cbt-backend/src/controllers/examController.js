const Exam = require('../models/Exam');
const Result = require('../models/Result');

exports.getExamsByClass = async (req, res) => {
    try {
        // Filters questions out to display titles, and selectively omits core solution validation from reaching standard payloads
        const list = req.params.className === 'all'
            ? await Exam.find()
            : await Exam.find({ targetClass: req.params.className });
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId);
        if (!exam) return res.status(404).json({ message: 'Examination not found.' });
        res.status(200).json(exam);
    } catch (err) {
        res.status(404).json({ message: 'Examination not found.' });
    }
};

exports.submitCbtResult = async (req, res) => {
    try {
        const { examId, score, totalQuestions } = req.body;
        const log = new Result({
            student: req.student.id,
            exam: examId,
            score,
            totalQuestions
        });
        await log.save();
        res.status(201).json({ message: 'CBT examination profile evaluated and saved safely.', log });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
