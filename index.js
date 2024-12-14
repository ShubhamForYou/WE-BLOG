const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const env = require("dotenv").config();
const connectDB = require("./connectDB");

// set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// DB-CONNECTION
connectDB(process.env.DB_URL)
  .then(() => {
    console.log("DB-CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res.render("home");
});
// server listening on PORT
app.listen(process.env.PORT, () => {
  console.log(`server listening ON PORT ${process.env.PORT} `);
});
