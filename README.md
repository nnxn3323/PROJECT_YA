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

Vercel의 `npm run build`는 `db:push`, `db:seed`, `next build` 순서로 실행됩니다. 따라서 `DATABASE_URL`이 Vercel에 등록되어 있으면 배포 과정에서 테이블과 seed 계정이 자동으로 준비됩니다.

## DB 연결 확인

배포 후 아래 주소를 열어 DB 연결 상태를 확인할 수 있습니다.

```text
https://your-vercel-domain.vercel.app/api/health/db
```

- `ok: true`: Vercel 런타임에서 Neon 쿼리 성공
- `configured: false`: Vercel에 `DATABASE_URL`이 없음
- `userCount: 0`: DB는 연결됐지만 seed 데이터가 없음
- `passwordUserCount: 0`: 로그인용 비밀번호 해시 seed가 없음

로그인이 안 될 때는 먼저 헬스체크의 `userCount`, `passwordUserCount`를 확인하세요. 둘 중 하나가 0이면 `DATABASE_URL`이 등록된 환경에서 `npm run db:push`, `npm run db:seed`를 다시 실행하세요.
