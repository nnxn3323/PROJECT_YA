import { Activity, Database, Route } from "lucide-react";
import { AccountBar } from "@/components/app/account-bar";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/server-guard";

const metrics = [
  { label: "오늘 요청", value: "추후 연결", icon: Activity },
  { label: "DB 상태", value: "헬스체크 API 사용", icon: Database },
  { label: "전용 영역", value: "웹마스터", icon: Route }
];

export default async function MasterPage() {
  await requireRole("MASTER");

  return (
    <main className="safe-page">
      <AccountBar />
      <PageHeader
        label="웹마스터"
        title="사용량과 기록"
        description="웹마스터 계정만 접근할 수 있는 운영 대시보드입니다."
      />
      <section className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4" />
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <strong className="text-xl">{metric.value}</strong>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
