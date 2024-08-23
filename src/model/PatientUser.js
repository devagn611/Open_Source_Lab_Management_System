const mongoose = require("mongoose");


const PatientUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    // required: true,
  },
  bloodGroup: {
    type: String,
    // required: true,
  },
  allergies: {
    type: String,
  },
  role: {
    type: String,
    default: 'patient' // Default role is 'patient'
  }
});

const PatientUser = mongoose.model("patientUsers", PatientUserSchema);

module.exports = PatientUser;
