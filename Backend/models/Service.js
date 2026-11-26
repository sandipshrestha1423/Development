const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['offer', 'request'], 
    default: 'request'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending' 
  },
  fee: {
    type: Number,
    required: true,
  },
  feeUnit: {
    type: String,
    enum: ['Hour', 'Day', 'Job'],
    required: true,
  },
  preferredTime: {
    type: String,
  },
  preferredDay: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  skills: {
    type: String, 
  },
  experience: {
    type: String, 
  },
  education: {
    type: String, 
  },
  certifications: {
    type: String, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Service", serviceSchema);