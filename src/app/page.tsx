import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Megaphone,
  Shield,
  UserRound
} from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/db/schema";

const routes = [
  {
    href: "/student",
    title: "학생",
    description: "개인 정보와 일주일 시간표를 등록하고 수정합니다.",
    icon: CalendarDays,
    roles: ["STUDENT"]
  },
  {
    href: "/parent",
    title: "학부모",
    description: "자녀 시간표, 급식 신청, 수강료 결제 현황을 확인합니다.",
    icon: UserRound,
    roles: ["PARENT"]
  },
  {
    href: "/admin",
    title: "관리자",
    description: "학생 학습 상태, 급식, 결제, 성적 업로드를 관리합니다.",
    icon: Shield,
    roles: ["ADMIN"]
  },
  {
    href: "/master",
    title: "웹마스터",
    description: "웹 사용량과 기록을 확인하는 전용 영역입니다.",
    icon: BarChart3,
    roles: ["MASTER"]
  },
  {
    href: "/public",
    title: "공개 게시",
    description: "시험 성적, 전체 출석률, 공지사항을 확인합니다.",
    icon: Megaphone,
    roles: ["STUDENT", "PARENT", "ADMIN", "MASTER"]
  }
] satisfies Array<{
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  roles: UserRole[];
}>;

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  const visibleRoutes = role
    ? routes.filter((route) => route.roles.includes(role))
    : [];

  return (
    <main className="safe-page">
      <PageHeader
        label="HHH Academy"
        title="내 권한에 맞는 학원 관리"
        description="로그인한 계정 권한에 따라 접근 가능한 화면만 표시됩니다."
      />
      <section className="grid gap-3 sm:grid-cols-2">
        {visibleRoutes.map((route) => {
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
