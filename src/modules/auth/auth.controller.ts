import { RequestHandler, Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { signupRequestBodySchema } from "./auth.schema";

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
    const { username, password } = signupRequestBodySchema.parse(req.body);
    // throw new Error("HJemlo");
    await this.authService.signup({ username, password });
    res.status(200).json({
      message: "Inside new signup.",
    });
  });

  public signIn: RequestHandler = (req, res, next) => {
    console.log("Inside new signin");
    res.status(200).json({
      message: "Inside new signin.",
    });
  };
}
