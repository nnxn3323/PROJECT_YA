import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicPage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="공개 게시"
        title="공지와 공개 지표"
        description="시험 성적, 전체 출석률, 공지사항을 모두가 볼 수 있게 게시하는 라우트입니다. 세부 기능은 추후 개발합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            게시 영역 준비됨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            관리자 CSV 업로드와 공지 작성 기능이 연결되면 이 페이지에 공개 데이터가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
