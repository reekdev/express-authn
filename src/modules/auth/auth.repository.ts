import { PoolClient } from "pg";
import { SignInRequestDto, SignupRequestDto } from "./auth.dto";
import { PostgresConnector } from "../../db/postgres-connector";
import z from "zod";
import { DB_SCHEMA } from "../../shared/constants/db-schema";
import { findUserByEmailQueryResultRowSchema } from "./auth.schema";

export class AuthRepository {
  public async doesEmailExist(
    email: SignupRequestDto["email"]
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
        from "${DB_SCHEMA}"."users" as "u"
        where "u"."email" = $1
      );`;

      const values = [email];

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
    email: SignupRequestDto["email"];
    hashedPassword: string;
  }) {
    let client: PoolClient | null = null;
    const { email, hashedPassword } = params;
    try {
      client = await PostgresConnector.getClient();
      await client.query("begin");
      const query = `
      insert into "${DB_SCHEMA}"."users"
      (
        "email",
        "password_hash"
      )
      values
      (
        $1::text,
        $2::text
      ) returning "id";`;

      const values = [email, hashedPassword];

      await client.query(query, values);
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

  public async findUserByEmail(params: { email: SignInRequestDto["email"] }) {
    let client: PoolClient | null = null;
    const { email } = params;

    try {
      client = await PostgresConnector.getClient();
      await client.query("begin");
      const query = `
        select
          "u"."id",
          "u"."email",
          "u"."password_hash"
        from "${DB_SCHEMA}"."users" as "u"
        where
          "u"."email" = $1;
      `;

      const values = [email];

      const queryResult = await client.query(query, values);
      await client.query("commit");

      if (queryResult.rows.length !== 1) throw new Error("User not found.");

      const parsedRow = findUserByEmailQueryResultRowSchema.parse(
        queryResult.rows[0]
      );

      return parsedRow;
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
