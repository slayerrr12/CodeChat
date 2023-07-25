var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "StreamScript : a platform for collaborative coding " });
});

router.get("/about", function name(req, res, next) {
  res.render("about", {
    title: "StreamScript : a platform for collaborative coding ",
  });
});

module.exports = router;
