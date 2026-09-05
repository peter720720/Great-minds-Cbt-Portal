const mongoose = require('mongoose');

let schoolPortalConnection;

const connectSchoolPortalDB = async () => {
    if (!process.env.SCHOOL_PORTAL_MONGO_URL) {
        console.warn('School portal database is not configured.');
        return null;
    }

    try {
        schoolPortalConnection = await mongoose.createConnection(process.env.SCHOOL_PORTAL_MONGO_URL).asPromise();
        console.log('School portal database connected successfully.');
        return schoolPortalConnection;
    } catch (err) {
        console.error('School portal database link failed:', err.message);
        return null;
    }
};

const getApplicantModel = () => {
    if (!schoolPortalConnection) return null;

    const ApplicantSchema = new mongoose.Schema({
        studentId: String,
        fullName: String,
        email: String,
        profilePicture: String,
        classApplied: String,
    }, { collection: 'applicants', strict: false });

    return schoolPortalConnection.models.Applicant
        || schoolPortalConnection.model('Applicant', ApplicantSchema);
};

module.exports = { connectSchoolPortalDB, getApplicantModel };
