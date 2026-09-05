const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    fullName: { type: String, default: 'Portal Student' },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    academicClass: { 
        type: String, 
        required: true,
        enum: [
            'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
            'Jss 1', 'Jss 2', 'Jss 3', 'Ss 1', 'Ss 2', 'Ss 3'
            , 'All Students'
        ]
    },
    feesPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
