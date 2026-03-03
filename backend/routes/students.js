var express = require("express");
var router = express.Router();

require("../models/connection");
const Student = require("../models/students");
const Invitation = require("../models/invitations");
const { checkBody } = require("../modules/checkBody");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

/* GET teachers students. */
// ne plus accepter teacherId dans le body (sécurité)
/* 
  authMiddleware,
  requireRole("teacher"), */
router.get("/getStudents", 
  authMiddleware,
  requireRole("teacher"),
  function (req, res) {
    if (!checkBody(req.body, ["teacherId"])) {
      res.json({ result: false, error: "Missing data" });
      return;
    }

    Student.find({ teacher: req.body.teacherId })
      .populate("user")
      .then((data) => {
        if (data != null) {
          let students = [];
          for (let obj of data) {
            let invite = false;
            Invitation.findOne({
              teacher: req.body.teacherId,
              email: obj.user.email,
            }).then((inviteFound) => {
              if (inviteFound != null) {
                invite = true;
              }
              students.push({
                firstName: obj.user.firstName,
                lastName: obj.user.lastName,
                discipline: obj.discipline,
                status: obj.status,
                subscription: obj.subscription.type,
                invite: invite,
              });
              console.log(students)
            });
          }
          res.json({ result: true, students: students });
        } else {
          res.json({ result: false });
        }
      });
  },
);

// ne plus accepter teacherId dans le body (sécurité)
router.get("/subscription", 
  authMiddleware,
  requireRole("teacher"),
  function (req, res) {
  if (!checkBody(req.body, ["teacherId"])) {
    res.json({ result: false, error: "Missing data" });
    return;
  }

  Student.find({ teacher: req.body.teacherId })
    .populate("user")
    .then((data) => {
      if (data != null) {
        let subscriptions = [];
        for (let obj in data) {
          subscriptions.push({
            firstName: obj.user.firstName,
            lastName: obj.user.lastName,
            subscription: obj.subscription,
          });
        }
        res.json({ result: true, subscription: subscriptions });
      } else {
        res.json({ result: false });
      }
    });
});

router.post("/addStudent", function (req, res) {
  //Standby
  if (!checkBody(req.body, ["teacherId"])) {
    res.json({ result: false, error: "Missing data" });
    return;
  }
  res.json({ result: false });
});

module.exports = router;
