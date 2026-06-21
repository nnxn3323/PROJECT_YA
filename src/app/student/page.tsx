import { PageHeader } from "@/components/app/page-header";
import { ScheduleBoard } from "@/components/schedule/schedule-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentWorkspace } from "@/lib/data";

export default async function StudentPage() {
  const { student, lessons } = await getStudentWorkspace();

  return (
    <main className="safe-page">
      <PageHeader
        label="학생"
        title={`${student.name} 시간표`}
        description="수업과 개인 일정을 등록하고, 카드 캐러셀 또는 시간표로 확인합니다."
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
