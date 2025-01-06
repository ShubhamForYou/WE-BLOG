const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const env = require("dotenv").config();
const connectDB = require("./connectDB");
const staticRoute = require("./routes/staticRoutes");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authentication");
const cloudinary = require("cloudinary").v2;
const blogModel = require("./models/blog");

// set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// DB-CONNECTION
connectDB(process.env.DB_LOCAL_URL)
  .then(() => {
    console.log("DB-CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });
// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie);

// routes
app.get("/", async (req, res) => {
  const allBlogs = await blogModel.find({}).sort("createdAt");
  res.render("home", { user: req.user,
    blogs:allBlogs
   });
});
app.use("/", staticRoute);
app.use("/api/user", userRoute);
app.use("/blog", blogRoute);

// server listening on PORT
app.listen(process.env.PORT, () => {
  console.log(`server listening ON PORT ${process.env.PORT} `);
});
