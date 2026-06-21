# HHH Academy

Next.js App Router, Neon PostgreSQL, Drizzle ORM, Tailwind CSS, shadcn/ui 스타일 컴포넌트로 만든 학원 관리 웹앱 초안입니다.

## 주요 라우트

- `/student`: 학생 정보와 주간 시간표 등록/수정
- `/parent`: 자녀 시간표, 급식 신청 달력, 수강료 결제 상태
- `/admin`: 학생 학습 체크, 급식/결제 관리, 성적 CSV 업로드 자리
- `/master`: 웹마스터 사용량/기록 대시보드 자리
- `/public`: 시험 성적, 출석률, 공지사항 공개 게시 자리

## 실행

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

Neon 연결 후에는 `.env`의 `DATABASE_URL`을 실제 연결 문자열로 바꾸고 아래 명령을 실행합니다.

```bash
npm run db:push
npm run db:seed
```

## 배포

Vercel 프로젝트에 `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 환경 변수를 등록한 뒤 배포하면 됩니다. 현재 인증은 역할별 화면 설계를 위한 데모 세션으로 구성되어 있어, 실제 계정 로그인은 NextAuth 설정을 이어서 붙이면 됩니다.

로컬 실행이 어렵다면 GitHub에 올린 뒤 Vercel에서 바로 import하면 됩니다. Vercel 빌드 명령은 기본값 `npm run build`를 쓰고, Neon의 pooled connection string을 `DATABASE_URL`로 등록하세요.
