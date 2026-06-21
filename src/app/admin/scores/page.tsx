import { redirect } from "next/navigation";
import { AccountBar } from "@/components/app/account-bar";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canUseAdminRoute, roleHome } from "@/lib/access";
import { requireRole } from "@/lib/server-guard";

export default async function ScoreUploadPage() {
  const session = await requireRole("ADMIN");

  if (!canUseAdminRoute(session.user.adminLevel, 2)) {
    redirect(roleHome.ADMIN);
  }

  return (
    <main className="safe-page">
      <AccountBar />
      <PageHeader
        label="관리자"
        title="시험 성적 CSV 업로드"
        description="직원, 부대표, 대표 권한에서 사용할 성적 업로드 화면입니다. 세부 파싱과 게시 로직은 추후 개발합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>CSV 파일</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full rounded-md border border-border bg-card/80 p-3 text-sm"
            type="file"
            accept=".csv"
          />
          <Button disabled>업로드 준비 중</Button>
        </CardContent>
      </Card>
    </main>
  );
}
