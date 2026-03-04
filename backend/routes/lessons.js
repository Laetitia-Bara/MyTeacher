var express = require('express');
var router = express.Router();

require('../models/connection');
const Lesson = require('../models/lessons');
const { checkBody } = require('../modules/checkBody');

/* GET teachers students. */
router.get('/getLessons', function(req, res) {

  Lesson.find({teacher: req.body.teacherId})
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
