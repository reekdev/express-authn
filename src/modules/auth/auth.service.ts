import { hash } from "bcryptjs";
import type { SignInRequestDto, SignupRequestDto } from "./auth.dto";
import { AuthRepository } from "./auth.repository";

/** This is responsible for only the business logic */
export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  public async signup(params: SignupRequestDto) {
    console.log("AuthService: signup");
    const { email, password } = params;
    const doesEmailExist = await this.authRepository.doesEmailExist(email);

    if (doesEmailExist) throw new Error("Email is already taken.");

    const hashedPassword = await hash(password, 10);
    await this.authRepository.createUser({ email, hashedPassword });
  }

  public async signIn(params: SignInRequestDto) {
    const { email, password } = params;
    const doesEmailExist = await this.authRepository.doesEmailExist(email);

    if (!doesEmailExist) throw new Error("Invalid credentials");

    const storedUserDetail = await this.authRepository.findUserByEmail({
      email,
    });
  }
}
