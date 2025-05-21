import z from "zod";
import {
  signinRequestBodySchema,
  signupRequestBodySchema,
} from "./auth.schema";

/** Controller layer DTO **/

export interface SignupRequestDto {
  email: z.infer<typeof signupRequestBodySchema>["email"];
  password: z.infer<typeof signupRequestBodySchema>["password"];
}

export interface SignupResponseDto {
  id: number;
  username: string;
}

/** Repository layer DTO */
export interface UserDetail {
  id: number;
}

export interface SignInRequestDto {
  email: z.infer<typeof signinRequestBodySchema>["email"];
  password: z.infer<typeof signinRequestBodySchema>["password"];
}

/** Service layer DTO **/

export interface CreateUserDto {
  username: string;
  hashedPassword: string;
}

// export interface
