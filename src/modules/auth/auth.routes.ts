import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/sign-up", this.controller.signUp);
    this.router.post("/sign-in", this.controller.signIn);
  }
}
