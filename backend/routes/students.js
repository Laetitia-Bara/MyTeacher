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
router.get(
  "/getStudents",
  authMiddleware,
  requireRole("teacher"),
  function (req, res) {
    let students = [];
    Student.find({ teacher: req.user.userId })
      .populate("user")
      .then((data) => {
        if (data.length > 0) {
          Invitation.find({ teacher: req.user.userId })
            .then((invitation) => {
              for (let obj of data) {
                let invite =
                  invitation.find(
                    (element) => element.email === obj.user.email,
                  ) != undefined
                    ? false
                    : true;
                students.push({
                  id: obj._id,
                  firstName: obj.user.firstName,
                  lastName: obj.user.lastName,
                  email: obj.user.email,
                  phone: obj.phone,
                  discipline: obj.discipline,
                  status: obj.status,
                  structure: obj.structure,
                  subscription: obj.subscription,
                  invite: invite,
                });
              }
            })
            .then(() => {
              res.json({ result: true, students: students });
            });
        } else {
          res.json({ result: false, error: "No student found" });
        }
      });
  },
);

router.post("/addStudent", function (req, res) {
  //Standby
  
  res.json({ result: false });
});

/* 
  authMiddleware,
  requireRole("teacher"), */
router.put("/changeStatus",
  function (req, res) {

    if(!checkBody(req.body, ['id', 'status']))
    {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }

    Student.findOneAndUpdate({_id: req.body.id},{ status: req.body.status}, { //(filter, target, option)
      returnDocument: 'after'
    }).then((data) => {
        if(data)
        {
          res.json({ result: true, student: data});
        }else{
          res.json({ result: false, error: "No student found" });
        }
      })
});

module.exports = router;
