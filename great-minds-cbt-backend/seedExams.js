const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Exam = require('./src/models/Exam');

const mockExams = [];

const seedCbtExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected for exam seeding initialization...');

        // Clear existing mock exams to avoid duplicates
        await Exam.deleteMany({});
        console.log('Cleared existing examination slots.');

        if (mockExams.length > 0) await Exam.insertMany(mockExams);
        console.log('====================================================');
        console.log('SUCCESS: Exam collection is ready for administrator uploads.');
        console.log('====================================================');
        process.exit(0);
    } catch (error) {
        console.error('Seeding process failed:', error.message);
        process.exit(1);
    }
};

seedCbtExams();
