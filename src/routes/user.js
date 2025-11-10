import express from "express";
import { requireAuth } from "../middlewares/auth_required.js"
import { default as user } from "../controllers/user.js"

const router = express.Router();

router.get(
    "/dashboard/stats",
    requireAuth,
    user.statistics,
);


export default router;