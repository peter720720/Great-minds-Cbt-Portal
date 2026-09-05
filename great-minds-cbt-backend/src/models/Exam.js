const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    targetClass: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);
