import { Pool } from "pg";

export const dbPool = new Pool({
  host: "127.0.0.1",
  user: "reek",
  password: "root",
  database: "express-authn",
  port: 5432,
});
