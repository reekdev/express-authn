import { JsonWebTokenError, sign } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  "x8YUgCUA1kuA5QNn7Ad2c4iZL523uoS0N+JXCEX+6eBHJmZpIdAOUcFsF3qx7NZS0JcgT6BxPyTgQDaDvfCIMA==";
const REFRESH_TOKEN_LIFESPAN_DAYS = "";
const ACCESS_TOKEN_LIFESPAN_MINUTES = "";

type GenerateAccessTokenInput = {
  userId: number;
  username: string;
};

export function generateAccessToken(params: GenerateAccessTokenInput): string {
  const { userId, username } = params;

  const accessToken = sign({ userId, username }, ACCESS_TOKEN_SECRET, {
    expiresIn: `15m`,
  });

  return accessToken;
}
