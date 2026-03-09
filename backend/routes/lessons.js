var express = require('express');
var router = express.Router();

require('../models/connection');
const mongoose = require('mongoose');
const Lesson = require('../models/lessons');
const Teacher = require('../models/teachers');
const Student = require('../models/students');
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

/* GET teachers students. */
router.get('/getLessons',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {

  Lesson.find({teacher: req.user.userId})
  .then(data => {
    let lessons = [];
    
    if(data != null)
    {
      for(let obj of data)
      {
        lessons.push({
          id: obj._id,
          title: obj.title,
          startAt: obj.startAt,
          endAt: obj.endAt,
          desc: obj.teacherNotes,
          structure: obj.structure,
          lieu: obj.locationType
        })
      }
      console.log(lessons)
      res.json({result:true, lessons: lessons}) //lessons pluriel
    }else{
      res.json({result:false, error: "No lesson found"})}
  })
});
/*
  authMiddleware,
  requireRole("teacher"),*/
router.post('/postLesson',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {
    let arrayId = []
    if(Array.isArray(req.body.studentId))
    {
      for(let obj of req.body.studentId)
      {
        arrayId.push(new mongoose.Types.ObjectId(obj))
      }
    }else{
      arrayId.push(new mongoose.Types.ObjectId(req.body.studentId))
    }

    const newLesson = new Lesson({
      teacher: new mongoose.Types.ObjectId(req.body.teacherId),
      student: arrayId,
      title:req.body.title,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
      structure: req.body.structure,
      teachersNote: req.body.description,
      locationType: req.body.lieu,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    newLesson.save().then(() => {
      res.json({ result: true, lesson:newLesson.toObject({getters:true})});
    });
  });

router.delete('/deleteLesson',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {

  Lesson.deleteOne({teacher: req.user.userId})
  .then(result => {
    if(result.deletedCount > 0)
    {
      res.json({result:true})
    }else{
      res.json({result:false, error:"Lesson not found"})}
  })
});

// Get lessons des étudiants
router.get(
  "/getLessonsStudent",
  function (req, res) {
    Student.findOne({ user: req.user.userId })
      .then((student) => {
        if (!student) {
          res.json({ result: false, error: "Student not found" });
          return;
        }

        Lesson.find({ student: student._id }).then((data) => {
          let lessons = [];

          if (data != null) {
            for (let obj of data) {
              lessons.push({
                id: obj._id,
                title: obj.title,
                start: obj.startAt,
                end: obj.endAt,
                student: student._id,
                structure: obj.structure,
                location: obj.locationType,
                desc: obj.teacherNotes,
              });
            }

            res.json({ result: true, lessons: lessons });
          } else {
            res.json({ result: false, error: "No lesson found" });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({ result: false, error: "Server error" });
      });
  },
);

// Get lessons d'un étudiant par son id
router.get("/getLessonsStudentById/:studentId", function (req, res) {
  Student.findById(req.params.studentId)
    .then((student) => {
      if (!student) {
        res.json({ result: false, error: "Student not found" });
        return;
      }

      Lesson.find({ student: student._id }).then((data) => {
        let lessons = [];

        if (data != null) {
          for (let obj of data) {
            lessons.push({
              id: obj._id,
              title: obj.title,
              start: obj.startAt,
              end: obj.endAt,
              student: student._id,
              structure: obj.structure,
              location: obj.locationType,
              desc: obj.teacherNotes,
            });
          }

          res.json({ result: true, lessons: lessons });
        } else {
          res.json({ result: false, error: "No lesson found" });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({ result: false, error: "Server error" });
    });
});

module.exports = router;
