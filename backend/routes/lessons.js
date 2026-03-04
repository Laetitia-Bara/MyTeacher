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
    if(data != null)
    {
      res.json({result:true, lessons:data})
    }else{
      res.json({result:false})}
  })

  res.send('respond with a resource');
});

module.exports = router;
