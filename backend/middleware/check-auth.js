const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token after Bearer
    const token = req.headers.authorization.split(" ")[1];
    // Decode Token and verify
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Append to request the email and user ID
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "You are not authenticated" });
  }
};
