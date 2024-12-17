const asyncHandler = require("express-async-handler");
const userModel = require("../models/user");
// @desc user registration or sign-in
// @route POST /api/user/signin
// @access public

const signin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  if (await userModel.findOne({ email })) {
    res.status(409).redirect("/login");
    throw new Error("user is already registered ");
  }
  await userModel.create({
    name,
    email,
    password,
  });

  return res.status(201).redirect("/login");
});

// @desc user log-in
// @route POST /api/user/login
// @access public
const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error("all fields are mandatory");
  }
  if (await userModel.findOne({ email })) {
    const user = await userModel.matchPassword(email, password);
    if (user) {
      return res.status(200).redirect("/");
    }
  } else {
    res.status(404).redirect("/signin");
  }
});

module.exports = { signin, login };
