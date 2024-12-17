const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashPassword = await bcrypt.hash(user.password, 10);
  user.password = hashPassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("user not found");
  if (await bcrypt.compare(password, user.password)) {
    return {
      name: user.name,
      role: user.role,
      email: user.email,
      userID: user.id,
    };
  } else {
    res.status(401);
    throw new Error("incorrect password or email");
  }
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

// userSchema.pre("save", function (next) {
//   const user = this;
//   if (!user.isModified("password")) return next();
//   const salt = randomBytes(16).toString();
//   const hashPassword = createHmac("sha256", salt)
//     .update(user.password)
//     .digest("hex");

//   user.salt = salt;
//   user.password = hashPassword;
//   next();
// });

// userSchema.static("matchPassword", async function (email, password) {
//   const user = await this.findOne({ email });
//   if (!user) throw new Error("user not found");
//   const salt = user.salt;
//   const hashPassword = user.password;
//   const userProvidedPassword = createHmac("sha256", salt)
//     .update(password)
//     .digest("hex");
//   if (hashPassword !== userProvidedPassword)
//     throw new Error("Incorrect password");
//   return { ...user, password: undefined, salt: undefined };
// });
