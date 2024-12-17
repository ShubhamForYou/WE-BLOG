const express = require("express");
const { signin, login } = require("../controllers/user");
const router = express.Router();

router.post("/signin", signin);
router.post("/login", login);

module.exports = router;
