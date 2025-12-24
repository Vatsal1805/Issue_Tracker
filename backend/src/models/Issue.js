const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
      type: String,
      enum: ["Cloud Security", "Red Team Assessment", "VAPT"],
      required: true,
    },
    status: {
      type: String,
      default: "Open",
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);