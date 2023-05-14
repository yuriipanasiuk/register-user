import { Pool } from "pg";
import { config } from "dotenv";
config();

const { DB_HOST, DB_PORT, DB_PASSWORD, DB_USER, DB_NAME } = process.env;

const pool = new Pool({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
});

export default pool;
