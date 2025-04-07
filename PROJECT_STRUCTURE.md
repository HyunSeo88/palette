<<<<<<< Updated upstream
# 프로젝트 구조

## 1. 개요
색각 이상자를 위한 패션 커뮤니티 웹 애플리케이션입니다. 사용자들이 서로의 패션 스타일을 공유하고, 색상 조합에 대한 조언을 주고받을 수 있는 플랫폼을 제공합니다.

## 2. 기술 스택
- Frontend: React.js, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- 상태 관리: Context API
- 스타일링: Styled-components

## 3. 디렉토리 구조

```
/
├── client/                     # 프론트엔드 코드
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── MainLayout.js  # 메인 레이아웃 컴포넌트
│   │   │   └── sections/      # 섹션별 컴포넌트
│   │   │       ├── Values.js
│   │   │       ├── HotPosts.js
│   │   │       ├── BestOutfit.js
│   │   │       ├── TodaysPoll.js
│   │   │       └── BrandDiscounts.js
│   │   ├── contexts/         # Context API 관련 파일
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 서비스
│   │   ├── styles/          # 전역 스타일
│   │   └── utils/           # 유틸리티 함수
│   └── public/              # 정적 파일
│
├── server/                  # 백엔드 코드
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── models/         # 데이터 모델
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── middleware/     # 미들웨어
│   │   └── utils/          # 유틸리티 함수
│   └── config/             # 설정 파일
│
└── docs/                   # 문서
    ├── PROJECT_STRUCTURE.md # 프로젝트 구조 문서
    └── tasks/              # 작업 문서

```

## 4. 주요 컴포넌트

### MainLayout
- 화면을 35% 왼쪽 패널과 65% 오른쪽 패널로 분할
- 왼쪽 패널에 회전하는 팔레트 메뉴 표시
- 오른쪽 패널에 선택된 섹션의 컨텐츠 표시

### 섹션 컴포넌트
1. Values (우리의 가치)
   - 커뮤니티의 핵심 가치와 목표 표시
   - 색각 이상자를 위한 지원 방식 설명

2. HotPosts (인기 게시물)
   - 좋아요와 댓글이 많은 게시물 표시
   - 실시간 업데이트 기능

3. BestOutfit (오늘의 베스트 착장)
   - 선정된 베스트 착장 소개
   - 색상 조합 팁과 설명 포함

4. TodaysPoll (오늘의 투표)
   - 패션/색상 관련 투표
   - 실시간 투표 결과 표시

5. BrandDiscounts (브랜드 할인정보)
   - 협력 브랜드의 할인 정보
   - 색각 이상자 친화적 제품 추천

## 5. 데이터 모델

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

## 6. API 구조

### 인증
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

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

## 7. 포인트/레벨 시스템

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
=======
# 프로젝트 구조

## 1. 개요
색각 이상자를 위한 패션 커뮤니티 웹 애플리케이션입니다. 사용자들이 서로의 패션 스타일을 공유하고, 색상 조합에 대한 조언을 주고받을 수 있는 플랫폼을 제공합니다.

## 2. 기술 스택
- Frontend: React.js, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- 상태 관리: Context API
- 스타일링: Styled-components

## 3. 디렉토리 구조

```
/
├── client/                     # 프론트엔드 코드
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── MainLayout.js  # 메인 레이아웃 컴포넌트
│   │   │   └── sections/      # 섹션별 컴포넌트
│   │   │       ├── Values.js
│   │   │       ├── HotPosts.js
│   │   │       ├── BestOutfit.js
│   │   │       ├── TodaysPoll.js
│   │   │       └── BrandDiscounts.js
│   │   ├── contexts/         # Context API 관련 파일
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 서비스
│   │   ├── styles/          # 전역 스타일
│   │   └── utils/           # 유틸리티 함수
│   └── public/              # 정적 파일
│
├── server/                  # 백엔드 코드
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── models/         # 데이터 모델
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── middleware/     # 미들웨어
│   │   └── utils/          # 유틸리티 함수
│   └── config/             # 설정 파일
│
└── docs/                   # 문서
    ├── PROJECT_STRUCTURE.md # 프로젝트 구조 문서
    └── tasks/              # 작업 문서

```

## 4. 주요 컴포넌트

### MainLayout
- 화면을 35% 왼쪽 패널과 65% 오른쪽 패널로 분할
- 왼쪽 패널에 회전하는 팔레트 메뉴 표시
- 오른쪽 패널에 선택된 섹션의 컨텐츠 표시

### 섹션 컴포넌트
1. Values (우리의 가치)
   - 커뮤니티의 핵심 가치와 목표 표시
   - 색각 이상자를 위한 지원 방식 설명

2. HotPosts (인기 게시물)
   - 좋아요와 댓글이 많은 게시물 표시
   - 실시간 업데이트 기능

3. BestOutfit (오늘의 베스트 착장)
   - 선정된 베스트 착장 소개
   - 색상 조합 팁과 설명 포함

4. TodaysPoll (오늘의 투표)
   - 패션/색상 관련 투표
   - 실시간 투표 결과 표시

5. BrandDiscounts (브랜드 할인정보)
   - 협력 브랜드의 할인 정보
   - 색각 이상자 친화적 제품 추천

## 5. 데이터 모델

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

## 6. API 구조

### 인증
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

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

## 7. 포인트/레벨 시스템

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
>>>>>>> Stashed changes
- Level 5: 1000점 이상 