import { RequestHandler } from "express";
import {
  doesUsernameAlreadyExistQueryResultSchema,
  signupRequestBodySchema,
} from "./sign-up.schema";
import { PoolClient } from "pg";
import { dbPool } from "../db-pool";
import { hash } from "bcryptjs";

export const signupHandler: RequestHandler = async (req, res) => {
  const rawRequestBody = req.body;
  console.log({ rawRequestBody });
  const parsedRequestBody = signupRequestBodySchema.parse(rawRequestBody);

  let client: PoolClient | null = null;

  try {
    client = await dbPool.connect();
    await client.query("begin");

    const { username, password } = parsedRequestBody;

    const doesUsernameAlreadyExistQuery = `
      select exists (
        select 1
        from "public"."users" as "u"
        where "u"."username" = $1
      ) as "doesUsernameAlreadyExist";
    `;
    const doesUsernameAlreadyExistQueryValues = [username];

    const doesUsernameAlreadyExistQueryResult = await client.query(
      doesUsernameAlreadyExistQuery,
      doesUsernameAlreadyExistQueryValues
    );

    const doesUsernameAlreadyExistQueryResultParsedRows =
      doesUsernameAlreadyExistQueryResultSchema.parse(
        doesUsernameAlreadyExistQueryResult.rows
      );

    if (
      doesUsernameAlreadyExistQueryResultParsedRows[0]?.doesUsernameAlreadyExist
    ) {
      res.status(409).json({ message: "Username already exists." });
    }
    const hashedPassword = await hash(password, 10);
    console.log({ hashedPassword });
    const query = `
      insert into "public"."users"
      (
        "username",
        "password_hash"
      )
      values
      (
        $1::text,
        $2::text
      );
    `;
    const values = [username, hashedPassword];

    await client.query(query, values);
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

  res.status(200).json({ message: "Inside signupHandler." });
};
