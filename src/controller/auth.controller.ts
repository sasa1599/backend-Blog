import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findReferralCode, findUser } from "../services/user.service";
import { verify } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword, username, email, role, referralCode } =
        req.body;
      if (password != confirmPassword)
        throw { message: "password not match !" };

      const user = await findUser(username, email);
      if (user) throw { message: "User or Email already exists !" };

      if (referralCode) {
        const referralUser = await findReferralCode(referralCode);
        if (!referralUser) throw { message: "Referral code not found !" };
      }
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          role: role || "User",
          refferedCode: referralCode || null,
        },
      });

      // butuh update user yg punya ref code dikasih point, bikin function add point

      // const addReferralPoint = find refcode, insert ke table point dengan jumlah 10.000, bikin expired 3 months

      const updatedUser = await prisma.user.update({
        where: { id: newUser.id },
        data: { refCode: newUser.id + newUser.username },
      });
      console.log(updatedUser);

      const payload = { id: newUser.id, role: newUser.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });
      const link = `${process.env.BASE_URL_FE}/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link });

      await transporter.sendMail({
        from: "shnazzhr@gmail.com",
        to: email,
        subject: "Registration Successful",
        html,
      });

      res.status(201).send({ message: "Register Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Account not found !" };
      if (user.isSuspend) throw { message: "Account has been suspended !" };
      if (!user.isVerify) throw { message: "Account has not been verified !" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) {
        await prisma.user.update({
          data: { loginAttempt: { increment: 1 } },
          where: { id: user.id },
        });
        if (user.loginAttempt == 2) {
          await prisma.user.update({
            data: { isSuspend: true },
            where: { id: user.id },
          });
        }
        throw { message: "Incorrect Password !" };
      }

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          //nambahin cookie
          httpOnly: true, //cookie hanya bisa diakses oleh server, dan tidak bisa diakses oleh client
          maxAge: 24 * 60 * 60 * 1000, //umur cookie
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({
          message: "Login Successfully",
          user,
          // token,
        });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      await prisma.user.update({
        where: { id: verifiedUser.id },
        data: { isVerify: true },
      });
      res.status(200).send({ message: "Email has been verified !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
