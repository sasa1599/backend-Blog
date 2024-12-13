import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { verifyToken } from "../middlewares/verify";

export class OrderRouter {
    private orderController: OrderController
    private router: Router
    constructor() {
        this.orderController = new OrderController();
        this.router = Router();
        this.initializeRoutes();
        
    }

    private initializeRoutes() {
        this.router.post("/", verifyToken, this.orderController.createOrder);
        this.router.post("/status", this.orderController.updateStatus);
    }

    getRouter(): Router {
        return this.router;
    }
}