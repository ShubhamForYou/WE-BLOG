const express = require("express");
const router = express.Router();

// @desc signin page
// @route GET /signin
// @access public

router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/login", (req, res) => {
  return res.render("login");
});
module.exports = router;
