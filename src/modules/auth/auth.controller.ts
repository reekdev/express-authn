import { RequestHandler, Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  signinRequestBodySchema,
  signupRequestBodySchema,
} from "./auth.schema";

type AsyncRequestHandler = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => Promise<void | any>;

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private asyncHander = (fn: AsyncRequestHandler): RequestHandler => {
    return (_req, _res, _next) => {
      fn(_req, _res, _next).catch(_next);
    };
  };

  public signUp: RequestHandler = this.asyncHander(async (req, res, next) => {
    console.log("Inside new signup");
    const { email, password } = signupRequestBodySchema.parse(req.body);
    await this.authService.signup({ email, password });
    res.status(200).json({
      message: "Inside new signup.",
    });
  });

  public signIn: RequestHandler = this.asyncHander(async (req, res, next) => {
    const { email, password } = signinRequestBodySchema.parse(req.body);

    await this.authService.signIn({ email, password });

    return res.status(200).json({
      message: "Inside new signin.",
    });
  });
}
