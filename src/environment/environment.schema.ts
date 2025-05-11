import z from "zod";
import { environments } from "./environments";

const portSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (value === undefined || value === null || value === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PORT is required in environment.",
      });
      return z.NEVER;
    }

    const possibleApplicationPort = Number(value);

    if (Number.isNaN(possibleApplicationPort)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PORT must be a number.",
      });
      return z.NEVER;
    }

    if (!Number.isInteger(possibleApplicationPort)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PORT must be an integer.",
      });
      return z.NEVER;
    }

    if (possibleApplicationPort < 1 || possibleApplicationPort > 65535) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PORT must be a number between 1-65535.",
      });
      return z.NEVER;
    }

    return possibleApplicationPort;
  });

// const a: z.infer<typeof portSchema> = 45

export const environmentSchema = z.object({
  NODE_ENV: z.enum(environments),
  PORT: portSchema,
});

export type ApplicationEnvironmentVariable = z.infer<typeof environmentSchema>;
