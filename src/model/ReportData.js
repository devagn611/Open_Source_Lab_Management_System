const mongoose = require("mongoose");

const ReportUserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'Select']
  },
  bloodGroup: {
    type: String,
    enum: ['a-positive', 'a-negative', 'b-positive', 'b-negative', 'ab-positive', 'ab-negative', 'o-positive', 'o-negative', 'Select']
  },
  allergies: {
    type: String,
  },
  medication: {
    type: String,
  }
});

const ReportData = mongoose.model("ReportData", ReportUserSchema);

module.exports = ReportData;