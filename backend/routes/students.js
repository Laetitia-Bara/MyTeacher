var express = require('express');
var router = express.Router();

require('../models/connection');
const Student = require('../models/students');
const { checkBody } = require('../modules/checkBody');

/* GET teachers students. */
router.get('/getStudents', function(req, res) {
  if (!checkBody(req.body, ['teacherId'])) {
    res.json({ result: false, error: 'Missing data' });
    return;
  }

  Student.find({teacher: req.body.teacherId})
  .then(data => {
    if(data != null)
    {
      res.json({result:true, students:data})
    }else{
      res.json({result:false})    
    }
  })
});

module.exports = router;
