import { Activity, Database, Route } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "오늘 요청", value: "추후 연결", icon: Activity },
  { label: "DB 상태", value: "Neon 연결 예정", icon: Database },
  { label: "주요 라우트", value: "5개 영역", icon: Route }
];

export default function MasterPage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="웹마스터"
        title="사용량과 기록"
        description="마스터 계정만 접근할 수 있는 웹 운영 대시보드입니다. 실제 로그 수집과 분석은 추후 개발합니다."
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
