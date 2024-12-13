import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../custom";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.header("Authorization")?.replace("Bearer ", ""); //gadipake soalnya udh pake cookie
    const token = req.cookies?.token;
    if (!token) throw new Error("Unauthorized!");

    const verifiedUser = verify(token, process.env.JWT_KEY!);

    req.user = verifiedUser as UserPayload;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "Admin") {
    next();
  } else {
    res.status(401).send("Admin Only!");
  }
};
