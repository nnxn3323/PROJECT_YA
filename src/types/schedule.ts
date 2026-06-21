import type { LessonMode, Subject } from "@/db/schema";

export type LessonView = {
  id: string;
  dayOfWeek: number;
  subject: Subject;
  title: string;
  location: string | null;
  mode: LessonMode;
  startTime: string;
  endTime: string;
  isLocked: boolean;
};
