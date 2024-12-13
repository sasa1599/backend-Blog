import { Router } from "express";
import { AuthController } from "../controller/auth.controller";


export class AuthRouter {
    private authController: AuthController;
    private router: Router;

    constructor() {
        this.authController = new AuthController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.authController.registerUser);
        this.router.post("/login", this.authController.loginUser)

        this.router.patch("/verify/:token", this.authController.verifyUser);
    }

    public getRouter(): Router {
        return this.router;
    }
}
