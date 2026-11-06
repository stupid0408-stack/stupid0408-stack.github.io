# 함승호 포트폴리오 · Supabase 실습 과제

비즈니스/데이터 분석 포트폴리오 사이트에 **방명록(Guestbook)** 기능을 구현한 프로젝트입니다.
가이드가 요구하는 **브라우저 → 서버 함수 → Supabase** 구조로, 방문자가 남긴 메시지를
Vercel 서버 함수를 거쳐 Supabase 데이터베이스에 **저장(insert)** 하고 **조회(select)** 합니다.

## 아키텍처

```
브라우저 (index.html)
   │  fetch GET/POST  /api/guestbook
   ▼
Vercel 서버 함수 (api/guestbook.js)   ← 서버 측 입력 검증 + Supabase 접근
   │
   ▼
Supabase (PostgreSQL: guestbook 테이블)
```

- 브라우저에는 **키가 전혀 들어가지 않습니다.** 모든 Supabase 접근은 서버 함수에서만 수행합니다.
- Supabase 키(`SUPABASE_SERVICE_ROLE_KEY`)는 Vercel 환경 변수에만 저장됩니다.

## 배포 링크

| 플랫폼 | 주소 | 비고 |
|--------|------|------|
| Vercel (실습 메인) | https://stupid0408-stackgithubio.vercel.app | 서버 함수 + Supabase |
| GitHub Pages | https://stupid0408-stack.github.io | 정적 화면만 (서버 함수는 동작하지 않음) |

> 서버 함수(`/api/guestbook`)는 **Vercel 주소에서만** 동작합니다.
> GitHub Pages는 서버 함수를 실행하지 않으므로 방명록 저장은 Vercel 주소에서 확인하세요.

## 사용 기술

- **프론트엔드**: HTML / CSS / JavaScript (`index.html`)
- **서버 함수**: Vercel Functions (`api/guestbook.js`, Node.js)
- **데이터베이스**: Supabase (PostgreSQL)
- **배포**: Vercel (GitHub push 시 자동 배포)

## API 명세

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/guestbook` | 최근 100건 방명록 조회 (최신순) |
| POST | `/api/guestbook` | 방명록 저장 (body: `{name, message}`) |

서버 검증: 별명 2~12자, 메시지 1~100자. 위반 시 400 + 사유 반환.

## 데이터베이스 설정

`supabase_setup.sql`을 Supabase SQL Editor에서 실행해 테이블과 보안(RLS)을 구성합니다.
브라우저 직접 접근 정책은 제거하고, 서버 함수(service_role)만 접근하도록 설정합니다.

## 환경 변수 (Vercel 대시보드에 입력)

| 이름 | 설명 |
|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role(secret) 키 — 서버 전용 |

(이름은 `.env.example` 참고. 실제 키 값은 깃/대화에 올리지 않습니다.)

## 완성 검사

입력 → 서버 저장 → 다른 기기 조회 → 재배포 후 유지 → 빈/과장 입력 거절 → XSS 방지까지
`docs/feature-plan.md`의 8단계 체크리스트로 확인합니다.
