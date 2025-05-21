import { Pool, PoolClient } from "pg";

export class PostgresConnector {
  private static instance: Pool | undefined = undefined;

  private constructor() {}

  public static getInstance(): Pool {
    if (!PostgresConnector.instance) {
      PostgresConnector.instance = new Pool({
        host: "127.0.0.1",
        user: "auth_user",
        password: "7XezX5Y0vzKf4CzyM0C857qa",
        database: "express-authn",
        port: 5433,
      });
      PostgresConnector.instance.on("error", (err, client) => {
        console.error("PostgreSQL Pool: Unexpected error on idle client", err);
        // process.exit(-1); // Optional: exit if pool errors are critical
      });
    }
    return PostgresConnector.instance;
  }

  public static async connect(): Promise<boolean> {
    try {
      const pool = this.getInstance();
      const client = await pool.connect();
      // test query
      const res = await client.query("select now()");
      console.log(
        `PostgreSQL database connected successfully.\nCurrent time from DB: ${res.rows[0]?.["now"]}`
      );
      client.release();
      return true;
    } catch (error) {
      console.error(`Failed to connect to PostgreSQL database.`);
      return false;
    }
  }

  public static async disconnect(): Promise<void> {
    if (PostgresConnector.instance) {
      await PostgresConnector.instance.end();
      console.log("PostgreSQL pool has been closed.");
      PostgresConnector.instance = undefined!; // Reset instance
    }
  }

  public static async getClient(): Promise<PoolClient> {
    const pool = this.getInstance();
    return pool.connect();
  }
}


