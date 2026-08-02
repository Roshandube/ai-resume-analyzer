const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract Token
      token = req.headers.authorization.split(" ")[1];
      console.log("Authorization Header:", req.headers.authorization);
      console.log("Extracted Token:", token);

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Save user id inside request
      req.user = decoded;

      next();
    } catch (error) {
      console.log("JWT ERROR:", error.message);

      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
  }
};

module.exports = protect;
