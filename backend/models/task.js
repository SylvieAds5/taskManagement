const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  status: {
    type: Boolean,
    default: false
  },

  dateDebut: {
    type: Date,
    required: true
  },

  dateFin: {
    type: Date,
    required: true
  },

  project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
  required: true
},

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Task", taskSchema);