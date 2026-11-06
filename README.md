# 함승호 포트폴리오 · Supabase 실습 과제

비즈니스/데이터 분석 포트폴리오 사이트에 **Supabase 방명록(Guestbook)** 기능을 연동한 프로젝트입니다.
방문자가 남긴 메시지를 Supabase 데이터베이스에 **저장(insert)** 하고, 최신순으로 **조회(select)** 하며, 실시간으로 화면에 반영합니다.

## 배포 링크

| 플랫폼 | 주소 |
|--------|------|
| GitHub Pages | https://stupid0408-stack.github.io |
| Netlify | (여기에 Netlify 주소 입력 — 예: https://xxxx.netlify.app) |
| Vercel | (여기에 Vercel 주소 입력 — 예: https://xxxx.vercel.app) |

세 플랫폼 모두 동일한 Supabase 프로젝트에 연결되어 있어, 어느 사이트에서 메시지를 남겨도 같은 방명록에 모입니다.

## 사용 기술

- **프론트엔드**: HTML / CSS / JavaScript (단일 `index.html`)
- **백엔드/DB**: Supabase (PostgreSQL + REST API + Realtime)
- **클라이언트 라이브러리**: `@supabase/supabase-js` (CDN import)
- **배포**: GitHub Pages, Netlify, Vercel (GitHub push 시 자동 배포)

## 데이터 흐름

```
방문자가 메시지 작성
      ↓
supabase-js 로 Supabase에 저장 (insert)
      ↓
guestbook 테이블에 기록 (PostgreSQL)
      ↓
최신순으로 다시 불러와 화면에 표시 (select)
```

## 주요 기능

- Supabase에 데이터 **저장** 및 **조회** (과제 필수 요건)
- 다른 방문자의 메시지도 새로고침 없이 반영되는 **실시간(Realtime)** 구독
- Row Level Security(RLS) 적용: 읽기/쓰기만 허용, 수정·삭제 차단
- 입력값 이스케이프로 XSS 방지

## 데이터베이스 설정

방명록 테이블과 보안 정책은 [`supabase_setup.sql`](./supabase_setup.sql)에 정리되어 있으며,
Supabase SQL Editor에서 실행하여 구성했습니다.

## 연결 설정

`index.html` 하단 `<script type="module">`에서 Supabase 프로젝트 URL과 anon public key로 연결합니다.
(anon key는 브라우저 노출을 전제로 한 공개 키이며, 실제 접근 제어는 RLS 정책이 담당합니다.)
