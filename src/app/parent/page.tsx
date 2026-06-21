import { eachDayOfInterval, format } from "date-fns";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { ScheduleBoard } from "@/components/schedule/schedule-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParentWorkspace } from "@/lib/data";

export default async function ParentPage() {
  const { student, lessons, mealRequests, payments, tomorrow, until } =
    await getParentWorkspace();
  const days = eachDayOfInterval({ start: tomorrow, end: until });
  const requestedDates = new Set(
    mealRequests.map((request) => format(request.date, "yyyy-MM-dd"))
  );

  return (
    <main className="safe-page">
      <PageHeader
        label="학부모"
        title={`${student.name} 보호자 페이지`}
        description="자녀의 시간표를 확인·수정하고 급식 신청과 수강료 결제 상태를 관리합니다."
      />
      <div className="space-y-4">
        <ScheduleBoard studentId={student.id} lessons={lessons} />

        <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
          <Card>
            <CardHeader>
              <CardTitle>급식 신청</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const active = requestedDates.has(key);
                  return (
                    <button
                      key={key}
                      className={`aspect-square rounded-md border border-white/45 text-xs font-semibold ${
                        active ? "bg-primary text-primary-foreground" : "bg-white/45"
                      }`}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>수강료</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="rounded-md bg-white/55 p-3">
                  <div className="flex items-center justify-between">
                    <strong>{payment.amount.toLocaleString()}원</strong>
                    <Badge>{payment.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    결제일 {format(payment.dueDate, "yyyy.MM.dd")}
                  </p>
                </div>
              ))}
              <Button className="w-full">
                <CreditCard className="h-4 w-4" />
                결제하기
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
