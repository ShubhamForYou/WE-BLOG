const jwt = require("jsonwebtoken");

const createTokenForUser = async (userObject) => {
  const payload = {
    id: userObject.id,
    name: userObject.name,
    email: userObject.email,
    profileImageURL: userObject.profileImageURL,
  };
  const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return payload;
};

module.exports = { createTokenForUser, validateToken };
