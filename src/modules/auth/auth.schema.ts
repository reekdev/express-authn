import z from "zod";

export const signupRequestBodySchema = z
  .object({
    email: z.string().trim().min(1).email(),
    password: z.string().trim(),
  })
  .strict();

export const signinRequestBodySchema = z
  .object({
    email: z.string().trim().min(1).email(),
    password: z.string().trim(),
  })
  .strict();

/** Database query result **/
export const findUserByEmailQueryResultRowSchema = z
  .object({
    id: z.coerce.number().int(),
    email: z.string(),
    password_hash: z.string(),
  })
  .strict();
