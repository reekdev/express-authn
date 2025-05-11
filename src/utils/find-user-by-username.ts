import { PoolClient } from "pg";
import z from "zod";

const findUserByUsernameQueryResultItemSchema = z
  .object({
    id: z.coerce.number().int(),
    username: z.string(),
    password_hash: z.string(),
  })
  .strict();

type FindUserByUsernameQueryResultItem = z.infer<
  typeof findUserByUsernameQueryResultItemSchema
>;

type UserRecord = {
  id: FindUserByUsernameQueryResultItem["id"];
  username: FindUserByUsernameQueryResultItem["username"];
  passwordHash: FindUserByUsernameQueryResultItem["password_hash"];
};

export const findUserByUsername = async (params: {
  client: PoolClient;
  data: { username: string };
}): Promise<UserRecord | null> => {
  const client = params.client;
  const username = params.data.username;

  const query = `
    select
      "u"."id",
      "u"."username",
      "u"."password_hash"
    from
      "public"."users" as "u"
    where "u"."username" = $1;
  `;

  const values = [username];
  const rawQueryResult = await client.query(query, values);

  if (rawQueryResult.rows.length !== 1) return null;

  const rawUserRecord = rawQueryResult.rows[0];

  const safeParseResult =
    findUserByUsernameQueryResultItemSchema.safeParse(rawUserRecord);

  if (!safeParseResult.success) return null;

  const validatedUserRecord = safeParseResult.data;

  const userRecord: UserRecord = {
    id: validatedUserRecord["id"],
    username: validatedUserRecord["username"],
    passwordHash: validatedUserRecord["password_hash"],
  };
  return userRecord;
};
