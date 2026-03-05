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
router.post('/addEvent',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {
    let arrayId = []
    if(Array.isArray(req.body.student))
    {
      for(let obj of req.body.student)
      {
        arrayId.push(new mongoose.Types.ObjectId(obj))
      }
    }else{
      arrayId.push(new mongoose.Types.ObjectId(req.body.student))
    }

    const newLesson = new Lesson({
      teacher: new mongoose.Types.ObjectId(req.user.userId),
      student: arrayId,
      title:req.body.title,
      startAt: req.body.start,
      endAt: req.body.end,
      structure: req.body.structure,
      teacherNotes: req.body.desc,
      locationType: req.body.location,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    newLesson.save().then(() => {
      res.json({ result: true, lesson:newLesson.toObject({getters:true})});
    });
  });

router.delete('/removeEvent/:id',
  authMiddleware,
  requireRole("teacher"),
  function(req, res) {

  Lesson.deleteOne({_id: req.params.id})
  .then(result => {
    if(result.deletedCount > 0)
    {
      res.json({result:true})
    }else{
      res.json({result:false, error:"Lesson not found"})}
  })
});

module.exports = router;
