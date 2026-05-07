# morethan-log 기반 개인 블로그

이 프로젝트는 [morethan-log](https://github.com/morethanmin/morethan-log)를 기반으로 만든 개인 블로그/포트폴리오입니다.  
원본 구조를 그대로 가져다 쓰는 데서 끝내지 않고, 제 블로그 운영 방식에 맞게 기능과 동작을 직접 수정한 버전입니다.

## 무엇을 바꿨나

- Notion을 CMS로 쓰는 기본 구조는 유지
- 홈 검색 상태를 URL과 동기화
- 글 상세에 목차, 읽기 진행바, 읽기 시간, 이전/다음 글, 관련 글 추가
- 본문 로딩 속도를 개선하기 위해 일부 글은 `recordMap`을 서버에서 미리 내려주도록 최적화
- 아카이브, 태그, 카테고리 페이지 추가
- RSS(`feed.xml`), `sitemap.xml`, 구조화 데이터(JSON-LD) 보강
- Utterances 댓글 연동

## 기술 스택

- Next.js
- Notion API / `react-notion-x`
- React Query
- Vercel

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 확인하면 됩니다.

## 환경 변수

`.env.example`를 복사해서 `.env.local` 또는 배포 환경 변수로 설정하면 됩니다.

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 필수

- `NOTION_PAGE_ID`

### 선택

- `NEXT_PUBLIC_UTTERANCES_REPO`
- `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`

## 주로 수정하는 파일

- `config/profile.js`
- `config/site.js`
- `config/projects.js`
- `config/seo.js`
- `config/integrations.js`
- `.env.example`

## 메모

- 글 작성과 수정은 Git이 아니라 Notion에서 합니다.
- 댓글이 보이지 않으면 `NEXT_PUBLIC_UTTERANCES_REPO` 설정을 먼저 확인하면 됩니다.

## 원본 프로젝트

- Original: [morethanmin/morethan-log](https://github.com/morethanmin/morethan-log)
