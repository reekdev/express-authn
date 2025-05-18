import { PoolClient } from "pg";
import { SignupRequestDto } from "./auth.dto";
import { PostgresConnector } from "../../db/postgres-connector";
import z from "zod";

export class AuthRepository {
  public async doesUsernameExist(
    username: SignupRequestDto["username"]
  ): Promise<boolean> {
    let client: PoolClient | null = null;

    try {
      client = await PostgresConnector.getClient();
      await client.query("begin");

      const queryResultSchema = z.array(
        z.object({
          exists: z.boolean(),
        })
      );

      const query = `
      select exists (
        select 1
        from "public"."users" as "u"
        where "u"."username" = $1
      );`;

      const values = [username];

      const queryResult = await client.query(query, values);
      await client.query("commit");

      const parsedRows = queryResultSchema.parse(queryResult.rows);
      const doesUsernameExist = parsedRows[0]!["exists"];
      return doesUsernameExist;
    } catch (error) {
      if (client !== null) {
        try {
          await client.query("rollback");
        } catch (error) {}
      }
      throw error;
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  }

  public async createUser(params: {
    username: SignupRequestDto["username"];
    hashedPassword: string;
  }) {
    let client: PoolClient | null = null;
    const { username, hashedPassword } = params;

    try {
      client = await PostgresConnector.getClient();
      await client.query("begin");
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
      ) returning "id";`;

      const values = [username, hashedPassword];
      await client.query("commit");
    } catch (error) {
      if (client !== null) {
        try {
          await client.query("rollback");
        } catch (error) {}
      }
      throw error;
    } finally {
      if (client !== null) {
        client.release();
      }
    }
  }
}
