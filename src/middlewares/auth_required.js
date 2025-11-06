import { verifyAccessToken } from "../utils/tokens.js"


export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1]; // Get ["Bearer", "<Token>"][1]

  try {
    const payload = verifyAccessToken(token);
    
    // attach minimal user info. Do not trust anything else client sends.
    req.user = { id: payload.userId, email: payload.email, isAdmin: payload.isAdmin };
    next();
  } catch (err) {
    // differentiate expired vs invalid
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}


export function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  }else {
    return res.status(403).json({ error: "Forbidden: You do not have the permission to access this resource."});
  }
}