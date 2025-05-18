import { hash } from "bcryptjs";
import type { SignupRequestDto } from "./auth.dto";
import { AuthRepository } from "./auth.repository";

/** This is responsible for only the business logic */
export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  public async signup(params: SignupRequestDto) {
    console.log("AuthService: signup");
    const { username, password } = params;
    const doesUsernameExist = await this.authRepository.doesUsernameExist(
      username
    );

    if (doesUsernameExist) throw new Error("Username is already taken.");

    const hashedPassword = await hash(password, 10);
    // this.authRepository.createUser()
  }
}
