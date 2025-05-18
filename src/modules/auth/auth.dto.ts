import z from "zod";
import { signupRequestBodySchema } from "./auth.schema";

/** Controller layer DTO **/

export interface SignupRequestDto {
  username: z.infer<typeof signupRequestBodySchema>["username"];
  password: z.infer<typeof signupRequestBodySchema>["password"];
}

export interface SignupResponseDto {
  id: number;
  username: string;
}

/** Service layer DTO **/

export interface CreateUserDto {
  username: string;
  hashedPassword: string;
}

// export interface
