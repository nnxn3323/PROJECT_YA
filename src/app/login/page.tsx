import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="계정"
        title="로그인"
        description="계정 권한에 따라 학생, 학부모, 관리자, 웹마스터 화면만 접근할 수 있습니다."
      />
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>계정으로 계속</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<p className="text-sm text-muted-foreground">로그인 준비 중</p>}>
            <LoginForm />
          </Suspense>
          <div className="rounded-md bg-white/45 p-3 text-xs leading-5 text-muted-foreground">
            <p>Seed 기본 비밀번호: academy123!</p>
            <p>예시: student01@example.com</p>
            <p>예시: parent01@example.com</p>
            <p>예시: admin.director@example.com</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
