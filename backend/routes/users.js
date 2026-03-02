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

// helper lecture cookie
function getTokenFromReq(req) {
  // cookie first
  if (req.cookies && req.cookies.access_token) return req.cookies.access_token;
  // fallback tests / dev : Authorization header
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

// POST /users/signup/teacher
router.post("/signup/teacher", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // validation simple
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ result: false, error: "Missing fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ result: false, error: "Password too short" });
    }
    // vérifier si email déjà utilisé
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Email already used" });
    }
    // hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // create user
    const newUser = await User.create({
      role: "teacher",
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
    });
    // create teacher profile
    const newTeacher = await Teacher.create({
      user: newUser._id,
      discipline: [],
      structures: [],
    });
    // JWT
    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    // cookie
    setAuthCookie(res, token);
    // response
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

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ result: false, error: "Missing fields" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(401)
        .json({ result: false, error: "Invalid credentials" });
    }
    const isOk = await bcrypt.compare(password, user.passwordHash);
    if (!isOk) {
      return res
        .status(401)
        .json({ result: false, error: "Invalid credentials" });
    }

    // Récupérer teacherId/studentId pour renvoyer au front
    let teacherId = null;
    let studentId = null;

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: user._id });
      teacherId = teacher ? teacher._id : null;
    } else if (user.role === "student") {
      const Student = require("../models/students");
      const student = await Student.findOne({ user: user._id });
      studentId = student ? student._id : null;
    }
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    setAuthCookie(res, token);
    return res.status(200).json({
      result: true,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        teacherId,
        studentId,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

// GET /users/me
router.get("/me", async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!token)
      return res.status(401).json({ result: false, error: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user)
      return res.status(401).json({ result: false, error: "Unauthorized" });

    let teacherId = null;
    let studentId = null;

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: user._id });
      teacherId = teacher ? teacher._id : null;
    } else if (user.role === "student") {
      const Student = require("../models/students");
      const student = await Student.findOne({ user: user._id });
      studentId = student ? student._id : null;
    }
    return res.status(200).json({
      result: true,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        teacherId,
        studentId,
      },
    });
  } catch (e) {
    return res.status(401).json({ result: false, error: "Unauthorized" });
  }
});

// POST /users/logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token", { path: "/" });
  return res.status(200).json({ result: true });
});

module.exports = router;
