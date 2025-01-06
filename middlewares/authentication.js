const { validateToken } = require("../services/authentication");

const checkForAuthenticationCookie = (req, res, next) => {
  const token = req.cookies.Auth;
  if (token) {
    const payload = validateToken(token);
    req.user = payload;
    next();
  } else next();
};

module.exports = checkForAuthenticationCookie;
