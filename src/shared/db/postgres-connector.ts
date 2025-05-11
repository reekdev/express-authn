import { Pool } from "pg";

export class PostgresConnector {
  private static instance: Pool;

  private constructor() {}
}
