const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },

    avatarUrl: { type: String },
    phone: { type: String },
    address: { type: String },

    discipline: [{ type: String }],
    structures: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("teachers", teacherSchema);
