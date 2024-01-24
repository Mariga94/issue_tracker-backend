import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type with a custom interface
interface AuthenticatedRequest extends Request {
  userId?: string; // Add your custom properties here
}

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from the Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({error:'Authentication failed', message:'Authentication failed: no token provided'});
  }

  try {
    const jwtKey = process.env.JWT_KEY;
    if (!jwtKey) {
      return res.status(500).json({ error: 'Internal Server Error', message: 'JWT_KEY not defined' });
    }
    // Verify token and decode the payload
    const decoded: any = jwt.verify(token, jwtKey);
    // Add user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send('Authentication failed: invalid token');
  }
};

export default authenticateUser;
