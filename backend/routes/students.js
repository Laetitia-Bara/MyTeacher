var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Student = require("../models/students");
const Teacher = require("../models/teachers");
const Invitation = require("../models/invitations");
const { checkBody } = require("../modules/checkBody");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

/* GET teachers students. */
router.get(
  "/getStudents",
  authMiddleware,
  requireRole("teacher"),
  async function (req, res) {
    try {
      const teacher = await Teacher.findOne({ user: req.user.userId });
      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher profile not found" });
      }

      let students = [];

      const data = await Student.find({ teacher: teacher._id }).populate(
        "user",
      );

      if (data.length > 0) {
        const invitations = await Invitation.find({ teacher: teacher._id });

        for (let obj of data) {
          const firstName = obj.user?.firstName || obj.firstName || "";
          const lastName = obj.user?.lastName || obj.lastName || "";
          const email = obj.user?.email || obj.email || "";

          const hasInvite =
            invitations.find((element) => element.email === email) != undefined;

          // bouton inviter seulement pour un prospect sans invitation active
          const invite = obj.status === "Prospect" && !hasInvite;

          students.push({
            id: obj._id,
            firstName,
            lastName,
            email,
            phone: obj.phone,
            discipline: obj.discipline,
            status: obj.status,
            structure: obj.structure,
            subscription: obj.subscription,
            invite,
          });
        }

        return res.json({ result: true, students });
      } else {
        // quand plus de data mockées => result: true, students: []
        //return res.json({ result: false, error: "No student found" });
        return res.json({ result: true, students: [] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

/* POST addStudent */
router.post(
  "/addStudent",
  authMiddleware,
  requireRole("teacher"),
  async function (req, res) {
    try {
      if (!checkBody(req.body, ["firstName", "lastName", "email"])) {
        return res.json({ result: false, error: "Missing data" });
      }

      const firstName = req.body.firstName.trim();
      const lastName = req.body.lastName.trim();
      const email = req.body.email.toLowerCase().trim();

      // récupérer le vrai profile teacher
      const teacher = await Teacher.findOne({ user: req.user.userId });
      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher profile not found" });
      }

      // Vérifier si un vrai compte user existe déjà avec cet email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({
          result: false,
          error: "Un utilisateur avec cet email existe déjà",
        });
      }

      // Vérifier si un prospect/student existe déjà pour ce prof avec cet email
      const existingStudent = await Student.findOne({
        teacher: teacher._id,
        email,
      });

      if (existingStudent) {
        return res.status(409).json({
          result: false,
          error: "Un élève/prospect avec cet email existe déjà",
        });
      }

      const newStudent = await Student.create({
        teacher: teacher._id,
        firstName,
        lastName,
        email,
        status: "Prospect",
        subscription: null,
      });

      return res.status(201).json({
        result: true,
        student: {
          id: newStudent._id,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          email: newStudent.email,
          phone: newStudent.phone,
          discipline: newStudent.discipline,
          status: newStudent.status,
          structure: newStudent.structure,
          subscription: newStudent.subscription,
          invite: true,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

/* PUT updateIdentity */
router.put(
  "/updateIdentity",
  authMiddleware,
  requireRole("teacher"),
  async function (req, res) {
    if (
      !checkBody(req.body, [
        "studentId",
        "firstName",
        "lastName",
        "email",
        "phone",
      ])
    ) {
      res.json({ result: false, error: "Missing data" });
      return;
    }

    const teacher = await Teacher.findOne({ user: req.user.userId });
    Student.findOne({ _id: req.body.studentId, teacher: teacher._id })
      .populate("user")
      .then((student) => {
        if (!student) {
          res.json({ result: false, error: "Student not found" });
          return;
        }

        student.phone = req.body.phone;
        student.firstName = req.body.firstName;
        student.lastName = req.body.lastName;
        student.email = req.body.email.toLowerCase().trim();

        student
          .save()
          .then(() => {
            // si un user existe déjà, on sync aussi
            if (student.user) {
              student.user.firstName = req.body.firstName;
              student.user.lastName = req.body.lastName;
              student.user.email = req.body.email.toLowerCase().trim();

              student.user
                .save()
                .then(() => {
                  res.json({ result: true });
                })
                .catch((error) => {
                  console.log(error);
                  res.json({ result: false, error: "User update failed" });
                });
            } else {
              res.json({ result: true });
            }
          })
          .catch((error) => {
            console.log(error);
            res.json({ result: false, error: "Student update failed" });
          });
      })
      .catch((error) => {
        console.log(error);
        res.json({ result: false, error: "Server error" });
      });
  },
);

module.exports = router;
