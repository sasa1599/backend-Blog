import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";
import { cloudinaryUpload } from "../services/cloudinary";

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user);
      const { search, page = 1, limit = 20 } = req.query;

      const filter: Prisma.UserWhereInput = {};

      if (search) {
        // filter.username = { contains:search as string }
        filter.OR = [
          { username: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countUser = await prisma.user.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(+countUser._count._all / +limit);
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUsersId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      await prisma.user.create({ data: req.body });
      res.status(201).send("User created");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.update({ data: req.body, where: { id: +id } });
      res.status(200).send("User Edited");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: +id } });
      res.status(200).send("Deleted Successfully");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editAvatar(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Avatar not found !" };
      const link = `http://localhost:8000/api/public/avatar/${req.file.filename}`;
      await prisma.user.update({
        where: { id: req.user?.id },
        data: { avatar: link },
      });
      console.log(req.file);
      res.status(200).send({ message: "Avatar edited !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editAvatarCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Avatar not found !" };
      const { secure_url} = await cloudinaryUpload(req.file, "avatar");
      await prisma.user.update({
        where: { id: req.user?.id },
        data: { avatar: secure_url },
      });
      console.log(req.file);
      res.status(200).send({ message: "Avatar edited !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
