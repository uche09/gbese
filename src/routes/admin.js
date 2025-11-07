import express from "express";
import {validateRecordRange} from "../validators/record.js"
import getValidationErr from "../middlewares/get_validation_error.js"
import { requireAuth, isAdmin } from "../middlewares/auth_required.js"
import { default as stats } from "../controllers/admin_statistics.js"

const router = express.Router();

router.get(
    "/admin/stats",
    requireAuth,
    isAdmin,
    validateRecordRange,
    getValidationErr,
    stats.adminStats,
);

export default router;