const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const Invitation = require("../models/invitations");
const Teacher = require("../models/teachers");
const User = require("../models/users");

//-------------------------Helpers---------------------------------------------

// Helper hash token
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

//----------------------------Routes---------------------------------------

// POST /invitations  (teacher only)
router.post("/", authMiddleware, requireRole("teacher"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ result: false, error: "Missing fields" });
    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier que le prof a bien un teacher profile
    const teacher = await Teacher.findOne({ user: req.user.userId });
    if (!teacher)
      return res
        .status(404)
        .json({ result: false, error: "Teacher profile not found" });

    // Empêcher d’inviter un email déjà inscrit
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Email already used" });
    }

    // Refuser si une invitation active existe déjà pour cet email (pour ce prof)
    const existingActiveInvite = await Invitation.findOne({
      teacher: teacher._id,
      email: normalizedEmail,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });
    if (existingActiveInvite) {
      return res.status(409).json({
        result: false,
        error: "Active invitation already exists for this email",
      });
    }

    // Générer token brut + hash
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h
    await Invitation.create({
      teacher: teacher._id,
      email: normalizedEmail,
      tokenHash,
      expiresAt,
    });

    const inviteLink = `${process.env.FRONT_URL}/signup-student?token=${token}`;
    return res.status(201).json({
      result: true,
      inviteLink,
      expiresAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

module.exports = router;
