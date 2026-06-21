import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="계정"
        title="로그인"
        description="학생, 학부모, 관리자, 웹마스터 계정 인증을 연결할 자리입니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>데모 이동</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button asChild variant="glass">
            <Link href="/student">학생으로 보기</Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/parent">학부모로 보기</Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/admin">관리자로 보기</Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/master">웹마스터로 보기</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
