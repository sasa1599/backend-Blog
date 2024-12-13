"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Email is not valid"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 3 })
        .withMessage("Password must be at least 3 characters"),
    // .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1 })
    // .withMessage("Password must be strong"),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        next();
    }
];
