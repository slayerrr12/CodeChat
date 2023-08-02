var express = require('express');
var router = express.Router();
var Task = require('../models/task'); // Make sure to require your Task model

router.get('/createTask', async function(req, res) {
  try {
    var newTask = new Task();
    await newTask.save();
    res.redirect('/task/' + newTask._id);
  } catch (err) {
    console.log(err);
    res.render('error');
  }
});

router.get('/task/:id', async function(req, res) {
  try {
    if (req.params.id) {
      var data = await Task.findOne({_id: req.params.id});
      if (data) {
        res.render('task', {data: data});
      } else {
        res.render('error');
      }
    } else {
      res.render('error');
    }
  } catch (err) {
    console.log(err);
    res.render('error');
  }
});

module.exports = router;
