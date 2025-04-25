import { defineConfig } from "drizzle-kit";
import { parseDatabaseUrl } from "./utils/parseDBurl";
// import {  } from "./src/db/schema";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: parseDatabaseUrl(process.env.DATABASE_URL!, process.env.PEM!),
});
