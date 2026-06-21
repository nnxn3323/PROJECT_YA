import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScoreUploadPage() {
  return (
    <main className="safe-page">
      <PageHeader
        label="관리자"
        title="시험 성적 CSV 업로드"
        description="권한 2~4 관리자가 사용할 성적 업로드 화면입니다. 세부 파싱과 게시 로직은 추후 개발합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>CSV 파일</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full rounded-md border border-white/45 bg-white/60 p-3 text-sm"
            type="file"
            accept=".csv"
          />
          <Button disabled>업로드 준비 중</Button>
        </CardContent>
      </Card>
    </main>
  );
}
