const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    teacher: {
      type: mongoose.Schema.types.ObjectId,
      ref: "teachers",
      required: true,
    },

    avatarUrl: { type: String },
    phone: { type: String },
    discipline: { type: String },
    structure: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("students", studentSchema);
