import { validationResult } from "express-validator";

const valResult = validationResult.withDefaults({
    formatter: (error) => error.msg,
});


const getValidationErr = (req, res, next) => {
    const result = valResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            data: result.array(),
        });
    }

    next();
}

export default getValidationErr;