import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userRoleEnum = pgEnum("user_role", [
  "STUDENT",
  "PARENT",
  "ADMIN",
  "MASTER"
]);

export const adminLevelEnum = pgEnum("admin_level", [
  "ASSISTANT",
  "STAFF",
  "DEPUTY",
  "DIRECTOR"
]);

export const subjectEnum = pgEnum("subject", [
  "KOREAN",
  "MATH",
  "ENGLISH",
  "SCIENCE",
  "SOCIAL",
  "KOREAN_HISTORY",
  "ETC"
]);

export const lessonModeEnum = pgEnum("lesson_mode", ["ONLINE", "OFFLINE"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "REQUESTED",
  "PAID",
  "OVERDUE"
]);
export const publicPostTypeEnum = pgEnum("public_post_type", [
  "NOTICE",
  "TEST_SCORE",
  "ATTENDANCE"
]);

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable("users", {
  id: id(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  passwordHash: text("password_hash"),
  phone: varchar("phone", { length: 40 }),
  role: userRoleEnum("role").notNull(),
  adminLevel: adminLevelEnum("admin_level"),
  ...timestamps()
});

export const students = pgTable("students", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  school: varchar("school", { length: 100 }),
  grade: varchar("grade", { length: 20 }),
  memo: text("memo"),
  defaultTuition: integer("default_tuition").notNull().default(720000),
  nextPaymentDue: timestamp("next_payment_due", { withTimezone: true }),
  ...timestamps()
});

export const parents = pgTable("parents", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps()
});

export const parentStudents = pgTable(
  "parent_students",
  {
    parentId: text("parent_id")
      .notNull()
      .references(() => parents.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    relation: varchar("relation", { length: 40 }).notNull().default("guardian"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.parentId, table.studentId] })
  })
);

export const lessons = pgTable("lessons", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  subject: subjectEnum("subject").notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  location: varchar("location", { length: 120 }),
  mode: lessonModeEnum("mode").notNull().default("ONLINE"),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  isLocked: boolean("is_locked").notNull().default(true),
  ...timestamps()
});

export const studySessions = pgTable("study_sessions", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  adminUserId: text("admin_user_id"),
  subject: subjectEnum("subject").notNull(),
  content: text("content").notNull(),
  seatLabel: varchar("seat_label", { length: 40 }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps()
});

export const mealRequests = pgTable(
  "meal_requests",
  {
    id: id(),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    date: timestamp("date", { withTimezone: true }).notNull(),
    requested: boolean("requested").notNull().default(true),
    ...timestamps()
  },
  (table) => ({
    studentDate: unique().on(table.studentId, table.date)
  })
);

export const payments = pgTable("payments", {
  id: id(),
  studentId: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull().default(720000),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  ...timestamps()
});

export const publicPosts = pgTable("public_posts", {
  id: id(),
  type: publicPostTypeEnum("type").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps()
});

export const usageLogs = pgTable("usage_logs", {
  id: id(),
  path: text("path").notNull(),
  method: varchar("method", { length: 12 }).notNull(),
  userId: text("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type AdminLevel = (typeof adminLevelEnum.enumValues)[number];
export type Subject = (typeof subjectEnum.enumValues)[number];
export type LessonMode = (typeof lessonModeEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
