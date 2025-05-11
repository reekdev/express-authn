import { z } from "zod";

export const signupRequestBodySchema = z
  .object({
    username: z.string().trim().min(1),
    password: z.string().trim(),
  })
  .strict();

/** db query result schema */
export const doesUsernameAlreadyExistQueryResultSchema = z
  .array(
    z
      .object({
        doesUsernameAlreadyExist: z.boolean(),
      })
      .strict()
  )
  .length(1);
