# 프로젝트 구조

## 1. 개요
패션 커뮤니티를 위한 모던하고 직관적인 웹 플랫폼입니다. 사용자들이 서로의 패션 스타일을 공유하고 소통할 수 있는 공간을 제공합니다.

## 2. 기술 스택
- Frontend Framework: React
- UI Library: Material-UI (MUI)
- Animation: Framer Motion
- Styling: Styled Components & MUI Styled Engine
- Icons: React Feather

## 3. 디렉토리 구조

```
palette/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx        # 로그인 컴포넌트
│   │   │   │   └── Register.tsx     # 회원가입 컴포넌트
│   │   │   ├── CommunityFeed/
│   │   │   │   ├── components/
│   │   │   │   │   ├── OOTDPost.tsx      # OOTD 포스트 컴포넌트
│   │   │   │   │   └── OOTDPost.styles.ts # OOTD 포스트 스타일
│   │   │   └── MainLayout/
│   │   │       ├── MainLayout.tsx          # 메인 레이아웃 컴포넌트
│   │   │       └── MainLayout.styles.ts    # 레이아웃 스타일
│   │   ├── pages/                  # 페이지 컴포넌트
│   │   │   ├── LoginPage.tsx         # 로그인 페이지
│   │   │   ├── RegisterPage.tsx      # 회원가입 페이지
│   │   │   ├── MyPage.tsx            # 마이 페이지
│   │   │   ├── SettingsPage.tsx      # 설정 페이지
│   │   │   └── SocialOnboardingPage.tsx # 소셜 가입 후 추가 정보 입력 페이지
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # 인증 컨텍스트
│   │   ├── utils/
│   │   │   ├── api.ts             # API 설정
│   │   │   └── tokenUtils.ts      # 토큰 관리
│   │   └── theme/
│   │       └── theme.ts           # 테마 설정
│   ├── .env                      # 환경 변수
│   └── public/                   # 정적 파일
└── server/
    ├── src/
    │   ├── routes/
    │   │   └── auth.js           # 인증 라우트
    │   ├── middleware/
    │   │   └── auth.js           # 인증 미들웨어
    │   └── models/
    │       └── User.js           # 사용자 모델
    └── .env                      # 서버 환경 변수
```

## 4. 주요 컴포넌트

### MainLayout
- 반응형 레이아웃 구현
- 좌측 패널 (프로필, 메뉴, 커뮤니티 통계)
- 스크롤 연동 배경색 전환 효과
- 모바일 대응

### CommunityFeed
- OOTD 그리드 레이아웃
- 인기 게시물 섹션
- 이벤트 섹션
- 좋아요/댓글 수 표시
- 작성자 정보 표시

### 하위 컴포넌트
1. PostMetrics
   - 좋아요 수 표시
   - 댓글 수 표시
   - 북마크 기능

2. AuthorInfo
   - 작성자 아바타
   - 작성자 이름

3. FeedSection
   - 섹션 제목
   - 컨텐츠 그리드 레이아웃

## 5. 스타일 시스템

### 테마 설정
- Material-UI 테마 커스터마이즈
- 반응형 디자인 브레이크포인트
- 색상 팔레트 정의
- 타이포그래피 스케일

### 스타일 컴포넌트
- Styled Components 활용
- MUI Styled Engine 통합
- 반응형 스타일링
- 애니메이션 효과

## 6. 데이터 모델

### User
- 기본 정보 (이름, 이메일 등)
- 색각 이상 유형
- 선호하는 색상/스타일
- 포인트/레벨 정보

### Post
- 제목, 내용
- 이미지
- 색상 정보
- 작성자 정보
- 좋아요/댓글

### Comment
- 내용
- 작성자 정보
- 게시물 참조

### Poll
- 질문
- 선택지
- 투표 결과
- 기간 정보

## 7. API 구조

### 인증
- POST /api/auth/register  # 회원가입
- POST /api/auth/login    # 로그인
- POST /api/auth/logout   # 로그아웃
- GET /api/auth/me       # 현재 사용자 정보 조회
- POST /api/auth/refresh # 토큰 갱신

### 게시물
- GET /api/posts
- POST /api/posts
- GET /api/posts/:id
- PUT /api/posts/:id
- DELETE /api/posts/:id

### 투표
- GET /api/polls
- POST /api/polls
- POST /api/polls/:id/vote

### 사용자
- GET /api/users/:id
- PUT /api/users/:id
- GET /api/users/:id/posts

## 8. 포인트/레벨 시스템

### 포인트 획득
- 게시물 작성: 10점
- 댓글 작성: 5점
- 좋아요 받기: 2점
- 베스트 착장 선정: 50점

### 레벨 시스템
- Level 1: 0-100점
- Level 2: 101-300점
- Level 3: 301-600점
- Level 4: 601-1000점
- Level 5: 1000점 이상 