const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.error("🚨 No token found in request headers");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "").trim(); // Ensure correct format
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    console.log("✅ Decoded User:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
