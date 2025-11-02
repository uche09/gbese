import AppError from "../utils/app_error.js"
import {createUser} from "../services/user_service.js"
import db from "../models/index.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js"
import { Op } from "sequelize";
import dayjs from "dayjs";
import config from "../config/index.js";


const COOKIE_NAME = config.SESSION_COOKIE_NAME;

export async function registerUser(req, res) {
    
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        await createUser({username, email, password});
        return res.status(201).json({
            success: true,
            message: "User registered"
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Registration Failed"});
    }
    
}



export async function login(req, res) {

  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });
  
  if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials" });

  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, username: user.username, email: user.email });

  // Store refresh token in DB (so that we can easily revoke or delete/destroy)
  const expiresAt = dayjs().add(Number(config.REFRESH_TOKEN_EXPIRES), 'days').toDate();
  await db.RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt });

  // Set HttpOnly cookie (recommended)
  res.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: config.ENVIRONMENT === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.json({ success: true,
    user: { id: user.id, email: user.email, username: user.username },
    accessToken,
  });
}

export async function refresh(req, res) {
  let token = null;

  try{
    token = req.cookies[COOKIE_NAME] || req.body.refreshToken;
  } catch (error) {
    return res.status(401).json({success: false, error: "No refresh token"});
  }

  if (!token) return res.status(401).json({ success: false, error: "No refresh token" });

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    return res.status(403).json({ success: false, error: "Invalid refresh token" });
  }

  // Check DB for token and not revoked and not expired
  const dbToken = await db.RefreshToken.findOne({
    where: { token, userId: payload.userId, isRevoked: false, expiresAt: { [Op.gt]: new Date() } },
  });
  if (!dbToken) return res.status(403).json({ success: false, error: "Refresh token revoked or not found, please login" });

  // Issue new access token
  const accessToken = signAccessToken({ userId: payload.userId, email: payload.email });

  // Rotate refresh tokens: issue a new refresh token and revoke the old one
  const newRefreshToken = signRefreshToken({ userId: payload.userId, username: payload.username, email: payload.email });
  dbToken.isRevoked = true;
  await dbToken.save();

  // save new token
  const expiresAt = dayjs().add(Number(config.REFRESH_TOKEN_EXPIRES), 'days').toDate();
  await db.RefreshToken.create({ token: newRefreshToken, userId: payload.userId, expiresAt });

  // set cookie to new refresh token
  res.cookie(COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    secure: config.ENVIRONMENT === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.json({ success: true, accessToken });
}

export async function logout(req, res) {
  let token = null;
  try{
    token = req.cookies[COOKIE_NAME] || req.body.refreshToken;
  } catch (err) {
    return res.status(401).json({success: false, error: "Not logged in"})
  }

  if (token) {
    // revoke in DB
    await db.RefreshToken.update({ isRevoked: true }, { where: { token } });
  } else {
    return res.status(401).json({ success: false, error: "Not logged in" });
  }

  // clear cookie
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "strict", secure: config.ENVIRONMENT === "production" });
  res.json({ success: true });
}