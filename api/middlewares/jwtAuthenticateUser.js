import jwt from "jsonwebtoken";

// Decode JWT token and add user ID to request object
const authUser = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Authentication failed: no token provided");
  }

  try {
    // verify token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Add user ID to the requested object
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send("Authentication failed: invalid token");
  }
};

export default authUser;