const mongoose = require('mongoose');

const connectCbtDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Isolated Great Minds CBT Cluster Database Connected Successfully.');
    } catch (err) {
        console.error('CBT Database link failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectCbtDB;
