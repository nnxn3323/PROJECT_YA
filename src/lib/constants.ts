import type { AdminLevel, Subject, UserRole } from "@/db/schema";

export const subjectLabels: Record<Subject, string> = {
  KOREAN: "국어",
  MATH: "수학",
  ENGLISH: "영어",
  SCIENCE: "과탐",
  SOCIAL: "사탐",
  KOREAN_HISTORY: "한국사",
  ETC: "기타"
};

export const roleLabels: Record<UserRole, string> = {
  STUDENT: "학생",
  PARENT: "학부모",
  ADMIN: "관리자",
  MASTER: "웹마스터"
};

export const adminLevelRanks: Record<AdminLevel, number> = {
  ASSISTANT: 1,
  STAFF: 2,
  DEPUTY: 3,
  DIRECTOR: 4
};

export const adminLevelLabels: Record<AdminLevel, string> = {
  ASSISTANT: "조교",
  STAFF: "직원",
  DEPUTY: "부대표",
  DIRECTOR: "대표"
};

export const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
export const timetableHours = Array.from({ length: 19 }, (_, index) => index + 6);
