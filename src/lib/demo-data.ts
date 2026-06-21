import type { LessonView } from "@/types/schedule";

export const demoStudent = {
  id: "demo-student",
  name: "김하늘",
  school: "샘플고",
  grade: "2",
  defaultTuition: 720000,
  nextPaymentDue: new Date("2026-07-10")
};

export const demoLessons: LessonView[] = [
  {
    id: "lesson-1",
    dayOfWeek: 1,
    subject: "MATH",
    title: "수학 심화",
    location: "A룸",
    mode: "ONLINE",
    startTime: "18:00",
    endTime: "20:00",
    isLocked: true
  },
  {
    id: "lesson-2",
    dayOfWeek: 3,
    subject: "ENGLISH",
    title: "영어 독해",
    location: "온라인",
    mode: "ONLINE",
    startTime: "20:00",
    endTime: "22:00",
    isLocked: true
  }
];

export const demoStudents = [
  {
    ...demoStudent,
    activeStudy: {
      subject: "MATH" as const,
      content: "미적분 유형 풀이",
      seatLabel: "B-12",
      startedAt: new Date("2026-06-21T09:30:00+09:00")
    },
    lessons: demoLessons
  },
  {
    id: "demo-student-2",
    name: "이지민",
    school: "중앙고",
    grade: "1",
    defaultTuition: 720000,
    nextPaymentDue: new Date("2026-07-15"),
    activeStudy: null,
    lessons: [
      {
        id: "lesson-3",
        dayOfWeek: 2,
        subject: "SCIENCE" as const,
        title: "물리 개념",
        location: "C룸",
        mode: "OFFLINE" as const,
        startTime: "19:00",
        endTime: "21:00",
        isLocked: true
      }
    ]
  }
];
