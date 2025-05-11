import { RequestHandler } from "express";
import { PoolClient } from "pg";
import { dbPool } from "../db-pool";
import { signinRequestBodySchema } from "./sign-in.schema";
import { findUserByUsername } from "../utils/find-user-by-username";
import { compare } from "bcryptjs";
import { generateAccessToken } from "../utils/generate-access-token";

export const signinHandler: RequestHandler = async (req, res) => {
  const rawRequestBody = req.body;
  const rawRequestHeaders = req.headers;
  // console.log({ rawRequestBody });
  // console.log({ rawRequestHeaders });

  const nodeEnvironment = process.env?.["NODE_ENV"];
  console.log({ nodeEnvironment });

  const validatedRequestBody = signinRequestBodySchema.parse(rawRequestBody);

  let client: PoolClient | null = null;

  try {
    client = await dbPool.connect();
    await client.query("begin");
    const { username, password: providedPassword } = validatedRequestBody;

    const possibleUser = await findUserByUsername({
      client,
      data: { username },
    });

    if (possibleUser === null) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const { passwordHash: storedPasswordHash } = possibleUser;

    console.log({ storedPasswordHash });

    const isPasswordValid = await compare(providedPassword, storedPasswordHash);

    console.log({ isPasswordValid });

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid credentials.",
      });
      return;
    }

    const { id: userId } = possibleUser;

    const accessToken = generateAccessToken({ userId, username });
    console.log({ accessToken });

    await client.query("commit");
  } catch (error) {
    console.error("error", error);

    if (client !== null) {
      try {
        await client.query("rollback");
      } catch (error: unknown) {}
    }
  } finally {
    if (client !== null) {
      client.release();
    }
  }

  res.status(200).json({ message: "Inside signinHandler." });
};
