const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const Teacher = require("../models/teachers");

// helper JWT cookie
function setAuthCookie(res, token) {
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax", // protection anti-CSRF des cookies
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 jour
    path: "/",
  });
}

// POST /users/signup/teacher
router.post("/signup/teacher", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // 1) validation simple
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ result: false, error: "Missing fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ result: false, error: "Password too short" });
    }
    // 2) vérifier si email déjà utilisé
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Email already used" });
    }
    // 3) hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // 4) create user
    const newUser = await User.create({
      role: "teacher",
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
    });
    // 5) create teacher profile
    const newTeacher = await Teacher.create({
      user: newUser._id,
      discipline: [],
      structures: [],
    });
    // 6) JWT
    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    // 7) cookie
    setAuthCookie(res, token);
    // 8) response
    return res.status(201).json({
      result: true,
      user: {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        teacherId: newTeacher._id,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

module.exports = router;
