import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  userType: text("user_type", { enum: ["employer", "seeker"] }).notNull(),
  companyName: text("company_name"),
  title: text("title"),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  employerId: integer("employer_id")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: ["full-time", "part-time", "contract"] }).notNull(),
  requirements: text("requirements").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  seekerId: integer("seeker_id")
    .notNull()
    .references(() => users.id),
  status: text("status", { enum: ["pending", "accepted", "rejected"] })
    .notNull()
    .default("pending"),
  coverLetter: text("cover_letter").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true,
  companyName: true,
  title: true,
  bio: true,
  location: true,
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  location: true,
  salary: true,
  type: true,
  requirements: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  jobId: true,
  coverLetter: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
