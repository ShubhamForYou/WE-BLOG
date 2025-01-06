const userModel = require("../models/user");
const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");

// @desc user registration or sign-in
// @route POST /api/user/signin
// @access public

const signin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  if (await userModel.findOne({ email })) {
    return res.status(409).render("login", {
      error: "user is already registered ",
    });
  }
  const newUser = new userModel({
    name,
    email,
    password,
  });
  const user = await newUser.save();

  // manually upload userProfile to cloudinary
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        // folder
        public_id: uuid(),
        resource_type: "image",
      },
      async (err, cloudinaryResult) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Cloudinary upload failed", details: err });
        }
        // save logo url in DB
        user.profileImageURL = cloudinaryResult.secure_url;
        await user.save();
      }
    );
    // send the file data from memory to Cloudinary
    result.end(req.file.buffer);
  }
  return res.status(201).redirect("/login");
};

// @desc user log-in
// @route POST /api/user/login
// @access public
const login = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res.status(400).render("login", { error: "All fields are mandatory" });
  }
  if (await userModel.findOne({ email })) {
    const token = await userModel.matchPasswordAndGenerateToken(
      email,
      password
    );

    if (token) {
      return res.cookie("Auth", token).redirect("/");
    } else {
      return res.status(401).render("login", {
        error: "Incorrect Email or Password",
      });
    }
  } else {
    res.status(404).render("signin", {
      error: "User not found",
    });
  }
};
// @desc user log-out
// @route GET /api/user/logout
// @access public
const logout = (req, res) => {
  if (req.cookies.Auth) {
    res.clearCookie("Auth").redirect("/");
  }
};

module.exports = { signin, login, logout };
