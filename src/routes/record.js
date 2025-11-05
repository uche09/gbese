import express from "express";
import {validateNewRec} from "../validators/record.js"
import getValidationErr from "../middlewares/get_validation_error.js"
import { requireAuth } from "../middlewares/auth_required.js"
import { addRecord } from "../controllers/record.js"
const router = express.Router();

router.post(
    "/add-record",
    requireAuth,
    validateNewRec,
    getValidationErr,
    addRecord,
);

export default router;