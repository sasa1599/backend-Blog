
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
    // .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1 })
    // .withMessage("Password must be strong"),
  body("confirmPassword")
  .notEmpty()
  .withMessage("Password confirmation is required")
  .custom((value, { req}) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  }
];
