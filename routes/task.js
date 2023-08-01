const express = require("express");
const task = require("../models/task");
const router = express.Router();

router.get("/createTask", function (req, res) {
    const newTask = new task();

    newTask.save(function (err, data) {
        if (!err && data != null) {
            console.log(err);
            res.render("error");
        } else {
            res.redirect("/task/" + data.id);
        }
    });
});

router.get("/task/:id", function (req, res) {
    if (req.params.id) {
        task.findOne({ _id: req.params.id }, function (err, data) {
            if (err) {
                console.log(err);
                res.render("error");
            }
            if (data) {
                res.render("task", { data: data });
            }
            else {
                res.render('error');
            }
        });
    }
    else{
        res.render('error');
    }
});

module.exports = router;
