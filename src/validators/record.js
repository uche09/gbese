import { body, query } from "express-validator";

const validateNewRec = [
    body("customerName")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .bail()
        .isLength({max: 80})
        .withMessage("Limit username to 50 characters")
        .bail()
        .toLowerCase(),
        
    body("customerPhoneNumber")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Invalid phone number"),
        
    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid Email"),
    
    body("amount")
        .trim()
        .notEmpty()
        .toFloat()
        .withMessage("Expected an amount"),

    body("payment")
        .optional()
        .trim()
        .toFloat()
        .custom((value, {req}) => {
            if (Number(value) > Number(req.body.amount)) {
                throw new Error("Payment cannot outweigh purchased amount")
            }
            return true;
        })
        .withMessage("Payment cannot outweigh purchased amout"),

    body("transactionType")
        .trim()
        .notEmpty()
        .withMessage("Transaction type required")
        .bail()
        .toLowerCase()
        .isIn(["borrow", "lend"])
        .withMessage("Invalid transaction type"),
    
    body("dueDate")
        .trim()
        .notEmpty()
        .withMessage("Due date required")
        .bail()
        .isDate()
        .custom((value) => {
            console.log(typeof value);
            if (Date.parse(value) < Date.now()) {
                throw new Error("Expected a future date");
            }
            return true;
        }),

    body("description")
        .notEmpty()
        .withMessage("Description type required")
        .bail()
        .isLength({max: 5_000})
        .withMessage("Description too long"),
    
];


const validateAdminStatistics = [
    query("start")
        .optional()
        .trim()
        .isDate()
        .withMessage("Expected a date in query strig"),
    
    query("end")
        .optional()
        .trim()
        .isDate()
        .withMessage("Expected a date in query strig"),
];
export {validateNewRec, validateAdminStatistics};