# HHH Academy

Next.js App Router, Neon PostgreSQL, Drizzle ORM, Tailwind CSS, shadcn/ui 스타일 컴포넌트로 만든 학원 관리 웹앱 초안입니다.

## 주요 라우트

- `/login`: 이메일/비밀번호 로그인
- `/student`: 학생 정보와 주간 시간표 등록/수정
- `/parent`: 자녀 시간표, 급식 신청 달력, 수강료 결제 상태
- `/admin`: 학생 학습 체크, 급식/결제 관리, 성적 CSV 업로드 자리
- `/master`: 웹마스터 사용량/기록 대시보드 자리
- `/public`: 시험 성적, 출석률, 공지사항 공개 게시 자리

## 권한

- `STUDENT`: 학생 페이지와 공개 게시 페이지
- `PARENT`: 학부모 페이지와 공개 게시 페이지
- `ADMIN`: 관리자 페이지와 공개 게시 페이지
- `MASTER`: 웹마스터 페이지와 공개 게시 페이지

관리자는 `ASSISTANT`, `STAFF`, `DEPUTY`, `DIRECTOR` 레벨로 나뉩니다.

## 실행

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Seed 계정

모든 seed 계정의 기본 비밀번호는 `academy123!`입니다.

- 학생: `student01@example.com` ~ `student24@example.com`
- 학부모: `parent01@example.com` ~ `parent12@example.com`
- 조교 관리자: `admin.assistant@example.com`
- 직원 관리자: `admin.staff@example.com`
- 부대표 관리자: `admin.deputy@example.com`
- 대표 관리자: `admin.director@example.com`
- 웹마스터: `master@example.com`

## Vercel 배포

Vercel 프로젝트 환경변수에 아래 값을 등록합니다.

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`

Auth.js v5 호환을 위해 기존 이름도 함께 등록해두면 좋습니다.

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

`AUTH_SECRET`과 `NEXTAUTH_SECRET`은 같은 긴 랜덤 문자열을 넣어도 됩니다. 저장소에는 임시 fallback secret이 들어 있지만, 실제 운영 전에 반드시 Vercel 환경변수로 교체해야 합니다.

Neon 연결 전에도 데모 데이터로 화면은 렌더링됩니다. 실제 로그인과 DB 저장 기능을 쓰려면 `DATABASE_URL`을 등록한 뒤 `npm run db:push`, `npm run db:seed`를 실행해야 합니다.
