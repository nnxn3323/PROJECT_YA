import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { Upload } from "lucide-react";
import { AccountBar } from "@/components/app/account-bar";
import { PageHeader } from "@/components/app/page-header";
import { StudyCheckPanel } from "@/components/admin/study-check-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLevelRanks, subjectLabels } from "@/lib/constants";
import { getAdminWorkspace } from "@/lib/data";
import { requireRole } from "@/lib/server-guard";

export default async function AdminPage() {
  const session = await requireRole("ADMIN");
  const students = await getAdminWorkspace();
  const adminLevel = session.user.adminLevel ?? "ASSISTANT";
  const adminRank = adminLevelRanks[adminLevel];
  const canSeeOperations = adminRank >= 2;
  const canEditPayments = adminRank >= 3;

  return (
    <main className="safe-page">
      <AccountBar />
      <PageHeader
        label="관리자"
        title="학원 운영 관리"
        description="학생 시간표와 현재 학습 상태를 확인하고, 권한에 따라 급식·결제·성적 업로드를 관리합니다."
      />
      <section className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          {students.map((student) => {
            const totalMinutes = student.activeStudy ? 90 : 0;
            return (
              <Card key={student.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{student.name}</span>
                    <Badge>{student.school ?? "학교 미입력"}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">오늘 학원 체류</p>
                      <strong>{totalMinutes}분</strong>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs text-muted-foreground">등록 일정</p>
                      <strong>{student.lessons.length}개</strong>
                    </div>
                  </div>
                  {student.activeStudy ? (
                    <div className="rounded-md bg-primary/80 p-3 text-sm text-primary-foreground">
                      <strong>{subjectLabels[student.activeStudy.subject]}</strong>
                      <p className="mt-1">
                        {student.activeStudy.content} ·{" "}
                        {formatDistanceToNowStrict(student.activeStudy.startedAt, {
                          addSuffix: true,
                          locale: ko
                        })}
                      </p>
                    </div>
                  ) : null}
                  <StudyCheckPanel
                    studentId={student.id}
                    lessons={student.lessons}
                    activeStudy={student.activeStudy}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
        <aside className="space-y-4">
          {canSeeOperations ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>급식 현황</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>직원, 부대표, 대표 권한에서 날짜별 신청 현황을 확인합니다.</p>
                  <p>날짜별 신청자 집계 API와 연결할 자리입니다.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>결제 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    미납 결제 요청과 결제 현황 파악 기능 영역입니다.
                  </p>
                  <Button className="w-full">부모에게 결제 요청</Button>
                  {canEditPayments ? (
                    <Button className="w-full" variant="glass">
                      가격·결제일 변경
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>시험 성적 CSV</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="glass">
                    <Upload className="h-4 w-4" />
                    업로드 페이지 준비됨
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
