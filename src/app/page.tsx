import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, Shield, UserRound } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const routes = [
  {
    href: "/student",
    title: "학생",
    description: "개인 정보와 일주일 시간표를 등록하고 수정합니다.",
    icon: CalendarDays
  },
  {
    href: "/parent",
    title: "학부모",
    description: "자녀 시간표, 급식 신청, 수강료 결제 현황을 확인합니다.",
    icon: UserRound
  },
  {
    href: "/admin",
    title: "관리자",
    description: "학생 학습 상태, 급식, 결제, 성적 업로드를 관리합니다.",
    icon: Shield
  },
  {
    href: "/master",
    title: "웹마스터",
    description: "웹 사용량과 기록을 확인하는 전용 영역입니다.",
    icon: BarChart3
  }
];

export default function HomePage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="HHH Academy"
        title="학원 운영을 한 화면에"
        description="학생, 학부모, 관리자, 웹마스터가 각자의 권한으로 사용하는 모바일 중심 학원 관리 웹앱입니다."
      />
      <section className="grid gap-3 sm:grid-cols-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.href} href={route.href}>
              <Card className="h-full transition-transform hover:-translate-y-0.5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {route.title}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {route.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
