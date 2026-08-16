import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  passwordHash: varchar("password_hash", {
    length: 255,
  }).notNull(),

  role: userRoleEnum("role").notNull().default("user"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", {
    length: 200,
  }).notNull(),

  description: text("description"),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
