const mongoose = require('mongoose');

// User Schema for main users
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'labuser' // Default role is 'patient'
    }
});

const LabUser = mongoose.model('LabUser', UserSchema);

module.exports = LabUser;
