# 기능 명세: 방명록 (Guestbook)

## 다섯 문장 기획
- 내 홈페이지는 **나(함승호)의 비즈니스·데이터 분석 포트폴리오를 소개하는 곳**이다.
- 방문자는 **별명과 한 줄 메시지를 남긴다.**
- 서버에는 **별명, 메시지, 저장 시각**을 저장한다.
- 저장 후 화면에는 **최근 순으로 정렬된 방명록 목록**이 보인다.
- **다른 기기에서도 같은 글이 보이고, 재배포 후에도 기록이 유지되면** 완성이다.

## 아키텍처 (가이드 필수 구조)
```
브라우저(index.html)
   │  fetch GET/POST  /api/guestbook
   ▼
Vercel 서버 함수 (api/guestbook.js)   ← 입력 검증 + Supabase secret key 사용
   │
   ▼
Supabase (PostgreSQL: guestbook 테이블)
```
- 브라우저는 Supabase에 **직접 접근하지 않는다.** 모든 저장/조회는 서버 함수를 경유한다.
- Supabase 접근은 **서버 함수에서만** 서버용 키로 수행한다.

## 배포 서비스 선택: Vercel
- 이유: 저장소가 정적 사이트 루트 구조라 Vercel의 `/api` 함수 규칙이 추가 설정 없이 가장 깔끔하게 붙음.
- 함수 파일을 `api/` 폴더에 두면 `/api/guestbook` 경로로 자동 노출됨.

## API 명세
### `GET /api/guestbook`
- 응답: 최근 100건의 방명록 목록 (name, message, created_at) — 최신순

### `POST /api/guestbook`
- 요청 body: `{ "name": string, "message": string }`
- 서버 검증:
  - name: 2~12자
  - message: 1~100자
  - 조건 위반 시 400 에러 + 사유
- 성공 시: 201, 저장된 행 반환

## 저장 데이터 (guestbook 테이블)
| 열 | 설명 |
|----|------|
| id | 글 고유 번호 (자동 증가) |
| name | 별명 (2~12자) |
| message | 메시지 (1~100자) |
| created_at | 저장 시각 (자동) |

## 보안
- RLS 활성화. 브라우저용 공개 접근 정책은 제거하고, **서버 함수의 service_role 키만** 테이블에 접근.
- service_role 키는 Vercel 환경 변수(`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)에만 저장. 브라우저/깃/대화에 노출 금지.
- 사용자 입력은 HTML로 실행하지 않고 글자로만 표시 (XSS 방지).
- 수정/삭제 API는 만들지 않음.

## 완성 검사 방법 (8단계 체크리스트)
1. 배포 주소에서 방명록 입력 화면 + 목록 표시
2. 정상 입력 → 서버 저장 성공 메시지 → 목록에 반영
3. Supabase Table Editor에서 저장된 행 확인
4. 다른 기기/브라우저에서 같은 글 조회
5. 재배포 후에도 기록 유지
6. 빈 입력 / 너무 긴 입력 → 서버가 거절 + 사유 표시
7. 저장 실패 시 성공으로 표시하지 않음
8. `<b>태그</b>` 입력 시 굵게 실행되지 않고 글자로 표시
