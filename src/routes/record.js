import express from "express";
import {validateNewRec, validateRecordRange } from "../validators/record.js"
import getValidationErr from "../middlewares/get_validation_error.js"
import { requireAuth } from "../middlewares/auth_required.js"
import { addRecord, getUserRecords } from "../controllers/record.js"
const router = express.Router();

router.post(
    "/add-record",
    requireAuth,
    validateNewRec,
    getValidationErr,
    addRecord,
);

router.get(
    "/get-records",
    requireAuth,
    validateRecordRange,
    getValidationErr,
    getUserRecords,
)

export default router;