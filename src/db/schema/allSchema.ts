import {
  pgTable,
  varchar,
  uuid,
  primaryKey,
  timestamp,
  decimal,
  text,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for transaction type
export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOME",
  "EXPENSE",
]);

// Enum for recurring frequency
export const frequencyEnum = pgEnum("frequency", [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);

// Currencies table — central rate manager
export const currencies = pgTable("currencies", {
  code: varchar("code", { length: 3 }).primaryKey(), // INR, USD, EUR
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 5 }).notNull(),
  exchangeRateToBase: decimal("exchange_rate_to_base", {
    precision: 18,
    scale: 8,
  }).notNull(), // compared to BASE (e.g. USD)
});

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  preferredCurrency: varchar("preferred_currency", { length: 3 })
    .notNull()
    .default("INR"),
});

// Categories (optional per user)
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  userId: uuid("user_id").references(() => users.id),
});

// Transactions (includes income & expense)
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  note: text("note"),
  date: timestamp("date").notNull().defaultNow(),
  currency: varchar("currency", { length: 3 }).notNull(), // ISO code
  categoryId: uuid("category_id").references(() => categories.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

// Budgets
export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
  categoryId: uuid("category_id").references(() => categories.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

// Recurring Expenses
export const recurringExpenses = pgTable("recurring_expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  frequency: frequencyEnum("frequency").notNull(),
  nextDueDate: timestamp("next_due_date").notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});
