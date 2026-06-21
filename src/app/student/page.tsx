import { AccountBar } from "@/components/app/account-bar";
import { PageHeader } from "@/components/app/page-header";
import { ScheduleBoard } from "@/components/schedule/schedule-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentWorkspace } from "@/lib/data";
import { requireRole } from "@/lib/server-guard";

export default async function StudentPage() {
  await requireRole("STUDENT");
  const { student, lessons } = await getStudentWorkspace();

  return (
    <main className="safe-page">
      <AccountBar />
      <PageHeader
        label="학생"
        title={`${student.name} 시간표`}
        description="내 수업과 일정을 등록하고 카드 보기 또는 표 보기로 확인합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[22rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">학교</span>
              <strong>{student.school ?? "-"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">학년</span>
              <strong>{student.grade ?? "-"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">기본 수강료</span>
              <strong>{student.defaultTuition.toLocaleString()}원</strong>
            </div>
          </CardContent>
        </Card>
        <ScheduleBoard studentId={student.id} lessons={lessons} />
      </div>
    </main>
  );
}
