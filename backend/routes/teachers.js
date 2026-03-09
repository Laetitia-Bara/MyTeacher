var express = require("express");
var router = express.Router();

require("../models/connection");
const Teacher = require("../models/teachers");
const User = require("../models/users");
const authMiddleware = require("../middlewares/auth");
const { checkBody } = require("../modules/checkBody");

/* GET teachers students. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

// GET /teachers/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) {
      return res
        .status(404)
        .json({ result: false, error: "Teacher not found" });
    }

    return res.status(200).json({
      result: true,
      teacher: {
        id: teacher._id,
        user: teacher.user,
        avatarUrl: teacher.avatarUrl || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
        discipline: teacher.discipline || [],
        structures: teacher.structures || [],
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

// PUT /teachers/me
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { firstName, lastName, phone, address, avatarUrl, discipline } =
      req.body;

    const user = await User.findById(userId);
    const teacher = await Teacher.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ result: false, error: "User not found" });
    }

    if (!teacher) {
      return res
        .status(404)
        .json({ result: false, error: "Teacher not found" });
    }

    // Partie User
    if (typeof firstName === "string") user.firstName = firstName.trim();
    if (typeof lastName === "string") user.lastName = lastName.trim();

    // Partie Teacher
    if (typeof phone === "string") teacher.phone = phone.trim();
    if (typeof address === "string") teacher.address = address.trim();
    if (typeof avatarUrl === "string") teacher.avatarUrl = avatarUrl.trim();
    if (Array.isArray(discipline)) teacher.discipline = discipline;

    await user.save();
    await teacher.save();

    return res.status(200).json({
      result: true,
      profile: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        teacherId: teacher._id,
        avatarUrl: teacher.avatarUrl || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
        discipline: teacher.discipline || [],
        structures: teacher.structures || [],
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

module.exports = router;
