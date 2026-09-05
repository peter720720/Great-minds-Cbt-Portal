const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
