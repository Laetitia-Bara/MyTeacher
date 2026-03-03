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
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true,
    },

    avatarUrl: { type: String },
    phone: { type: String },
    discipline: { type: String },
    structure: { type: String },
    status: {
      type: String,
      enum: ['Inactif', 'Actif', 'Prospect'],
      default: 'Prospect'
    },
    subscription: {
      type: {
        type: String,
        enum: ['A l\'unité', 'Trimestre', 'Annuel'],
      },
      price: {type: Number},
      modalite: {type: String}
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("students", studentSchema);
