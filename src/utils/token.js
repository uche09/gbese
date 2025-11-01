import config from "../config/index.js";
import jwt from "jsonwebtoken";


export function signAccessToken(payload) {
  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES + 'm' || "15m" });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES + 'd' || "30d" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}
