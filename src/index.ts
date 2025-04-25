import { drizzle } from "drizzle-orm/node-postgres";
import { parseDatabaseUrl } from "../utils/parseDBurl";
import * as schemas from "./db/schema";
import { secret } from "encore.dev/config";
import pg from "pg";

const db_uri = secret("DB_URI");
const pem = secret("PEM");

export const pool = new pg.Pool(parseDatabaseUrl(db_uri(), pem()));

const db = drizzle(pool, { schema: schemas });

export default db;
