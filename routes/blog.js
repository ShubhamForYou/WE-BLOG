const express = require("express");
const router = express.Router();
const blogModel = require("../models/blog");
const upload = require("../middlewares/multerFileUploader");
const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");

// @desc add-new-blog-form
// @route POST /blog/add-new-blog-form
// @access
router.get("/add-new-blog-form", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// @desc add-new-blog
// @route POST /blog/add-new-blog
// @access
router.post(
  "/add-new-blog",
  upload.single("coverImageURL"),
  async (req, res) => {
    try {
      const { title, body } = req.body;
      if (!title || !body) {
        return res
          .status(400)
          .render("addBlog", { err: "All fields are mandatory" });
      }
      const blog = new blogModel({
        title,
        body,
        createdBy: req.user.id,
      });
      const newBlog = await blog.save();

      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          {
            public_id: uuid(),
            resource_type: "image",
          },
          async (err, cloudinaryResult) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Cloudinary upload failed", details: err });
            }
            newBlog.coverImageURL = cloudinaryResult.secure_url;
            await newBlog.save();
          }
        );
        result.end(req.file.buffer);
      }
      return res.render("home", { user: req.user });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
