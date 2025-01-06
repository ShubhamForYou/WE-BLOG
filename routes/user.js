const express = require("express");
const { signin, login,logout  } = require("../controllers/user");
const router = express.Router();
const upload = require("../middlewares/multerFileUploader");

router.post("/signin", upload.single("profileImageURL"), signin);
router.post("/login", login);
router.get("/logout",logout );
module.exports = router;
