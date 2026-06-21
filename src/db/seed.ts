import { eq } from "drizzle-orm";
import { db } from ".";
import {
  lessons,
  parentStudents,
  parents,
  payments,
  students,
  users,
  type AdminLevel,
  type Subject,
  type UserRole
} from "./schema";
import { hashPassword } from "@/lib/password";

const defaultPassword = "academy123!";

type SeedUserInput = {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  adminLevel?: AdminLevel | null;
  phone?: string;
};

async function upsertUser(input: SeedUserInput) {
  const database = db;
  if (!database) throw new Error("DATABASE_URL is required to seed users");

  const [user] = await database
    .insert(users)
    .values({
      email: input.email,
      name: input.name,
      role: input.role,
      adminLevel: input.adminLevel ?? null,
      passwordHash: input.passwordHash,
      phone: input.phone ?? null
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: input.name,
        role: input.role,
        adminLevel: input.adminLevel ?? null,
        passwordHash: input.passwordHash,
        phone: input.phone ?? null,
        updatedAt: new Date()
      }
    })
    .returning();

  return user;
}

function subjectFor(index: number): Subject {
  const subjects: Subject[] = [
    "KOREAN",
    "MATH",
    "ENGLISH",
    "SCIENCE",
    "SOCIAL",
    "KOREAN_HISTORY",
    "ETC"
  ];
  return subjects[index % subjects.length];
}

async function main() {
  const database = db;
  if (!database) {
    throw new Error("DATABASE_URL is required to seed the database");
  }

  const passwordHash = await hashPassword(defaultPassword);
  const createdStudents: Array<typeof students.$inferSelect> = [];

  for (let index = 1; index <= 24; index += 1) {
    const padded = String(index).padStart(2, "0");
    const user = await upsertUser({
      email: `student${padded}@example.com`,
      name: `Student ${padded}`,
      role: "STUDENT",
      passwordHash,
      phone: `010-1000-${String(index).padStart(4, "0")}`
    });

    const [student] = await database
      .insert(students)
      .values({
        userId: user.id,
        school: index % 2 === 0 ? "Sample High" : "Central High",
        grade: String((index % 3) + 1),
        nextPaymentDue: new Date(`2026-07-${String((index % 20) + 1).padStart(2, "0")}`)
      })
      .onConflictDoUpdate({
        target: students.userId,
        set: {
          school: index % 2 === 0 ? "Sample High" : "Central High",
          grade: String((index % 3) + 1),
          updatedAt: new Date()
        }
      })
      .returning();

    createdStudents.push(student);

    await database.delete(lessons).where(eq(lessons.studentId, student.id));
    await database.delete(payments).where(eq(payments.studentId, student.id));

    await database.insert(lessons).values([
      {
        studentId: student.id,
        dayOfWeek: (index % 5) + 1,
        subject: subjectFor(index),
        title: `${subjectFor(index)} regular class`,
        location: index % 2 === 0 ? "Room A" : "Online",
        mode: index % 2 === 0 ? "OFFLINE" : "ONLINE",
        startTime: "18:00",
        endTime: "20:00"
      },
      {
        studentId: student.id,
        dayOfWeek: ((index + 2) % 5) + 1,
        subject: subjectFor(index + 2),
        title: "Self study",
        location: "Study Zone",
        mode: "OFFLINE",
        startTime: "20:00",
        endTime: "22:00"
      }
    ]);

    await database.insert(payments).values({
      studentId: student.id,
      amount: 720000,
      dueDate: new Date(`2026-07-${String((index % 20) + 1).padStart(2, "0")}`),
      status: index % 6 === 0 ? "OVERDUE" : "PENDING"
    });
  }

  for (let index = 1; index <= 12; index += 1) {
    const padded = String(index).padStart(2, "0");
    const user = await upsertUser({
      email: `parent${padded}@example.com`,
      name: `Parent ${padded}`,
      role: "PARENT",
      passwordHash,
      phone: `010-2000-${String(index).padStart(4, "0")}`
    });

    const [parent] = await database
      .insert(parents)
      .values({ userId: user.id })
      .onConflictDoUpdate({
        target: parents.userId,
        set: { updatedAt: new Date() }
      })
      .returning();

    for (const child of [createdStudents[index - 1], createdStudents[index + 11]]) {
      if (!child) continue;
      await database
        .insert(parentStudents)
        .values({ parentId: parent.id, studentId: child.id })
        .onConflictDoNothing();
    }
  }

  const adminAccounts: Array<{
    email: string;
    name: string;
    adminLevel: AdminLevel;
  }> = [
    { email: "admin.assistant@example.com", name: "Assistant Admin", adminLevel: "ASSISTANT" },
    { email: "admin.staff@example.com", name: "Staff Admin", adminLevel: "STAFF" },
    { email: "admin.deputy@example.com", name: "Deputy Admin", adminLevel: "DEPUTY" },
    { email: "admin.director@example.com", name: "Director Admin", adminLevel: "DIRECTOR" }
  ];

  for (const account of adminAccounts) {
    await upsertUser({
      ...account,
      role: "ADMIN",
      passwordHash
    });
  }

  await upsertUser({
    email: "master@example.com",
    name: "Web Master",
    role: "MASTER",
    passwordHash
  });

  console.log(`Seed complete. Default password: ${defaultPassword}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
