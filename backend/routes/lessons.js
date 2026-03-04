var express = require('express');
var router = express.Router();

require('../models/connection');
const Lesson = require('../models/lessons');
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

router.post('/postLesson',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {

  const newLesson = new Lesson({
    teacher: req.body.teacherId,
    student: req.body.studentId,
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
    res.json({ result: true, lesson:newLesson});
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

module.exports = router;
