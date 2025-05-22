# API 가이드

이 문서는 Palette 프로젝트 백엔드 API의 사용법과 주요 변경 사항을 안내합니다.

## 목차

- [1. 게시물 (Posts) API](#1-게시물-posts-api)
  - [1.1 Post 모델 변경 사항 (OOTD 통합)](#11-post-모델-변경-사항-ootd-통합)
  - [1.2 게시물 생성 (Create Post)](#12-게시물-생성-create-post)
  - [1.3 게시물 수정 (Update Post)](#13-게시물-수정-update-post)
  - [1.4 게시물 목록 조회 (Get Posts)](#14-게시물-목록-조회-get-posts)
- [2. 댓글 (Comments) API](#2-댓글-comments-api)
- [3. 인증 (Auth) API](#3-인증-auth-api)

---

## 1. 게시물 (Posts) API

### 1.1 Post 모델 변경 사항 (OOTD 통합)

- **OOTD 기능 통합**: 기존 `Ootd` 모델이 `Post` 모델로 통합되었습니다.
- **`postType` 필드**:
    - `'ootd'` 타입이 추가되었습니다. (기존: `['fashion', 'free', 'qna', 'market', 'groupbuy']` -> 변경: `['fashion', 'free', 'qna', 'market', 'groupbuy', 'ootd']`)
    - OOTD 게시물 생성 시 `postType: 'ootd'`로 설정해야 합니다.
- **`content` 필드**:
    - OOTD 게시물의 경우, 기존 `caption`에 해당하던 내용이 `content` 필드에 저장됩니다. (최대 500자)
- **`images` 필드**:
    - OOTD 게시물의 경우, `images` 필드는 필수이며 최소 1개 이상의 이미지 URL을 포함해야 합니다.
- **`additionalFields` 필드**:
    - OOTD 게시물 관련 추가 정보 (예: `style`, `season`)는 `additionalFields` 객체 내에 저장됩니다.
      - 예: `additionalFields: { "style": "casual", "season": "spring" }`
- **`commentsCount` 필드**:
    - 게시물의 댓글 수를 직접 저장하는 `commentsCount` 필드 (Number, 기본값 0)가 추가되었습니다. 댓글 생성/삭제 시 자동으로 업데이트됩니다.
- **삭제된 OOTD 관련 파일**:
    - `server/src/models/ootd.model.js`
    - `server/src/controllers/ootd.controller.js`
    - `server/src/routes/ootd.routes.js`

### 1.2 게시물 생성 (Create Post)

- **Endpoint**: `POST /api/posts`
- **Auth**: 필요 (Bearer Token)
- **Request Body**:
    - `postType` (String, 필수): `'fashion'`, `'free'`, `'qna'`, `'market'`, `'groupbuy'`, `'ootd'` 중 하나.
    - `title` (String, 필수, 최대 200자)
    - `content` (String, 필수):
        - `postType: 'ootd'`인 경우: 캡션 내용 (최대 500자).
        - 그 외: 일반 게시물 내용.
    - `images` (Array of Strings):
        - `postType: 'ootd'`인 경우: 필수, 최소 1개 이상의 이미지 URL.
        - 그 외: 선택.
    - `tags` (Array of Strings, 선택)
    - `status` (String, 선택): `'published'`, `'draft'`, `'pending_review'` 등. 기본값 `'published'`.
    - `additionalFields` (Object, 선택):
        - `postType: 'ootd'`인 경우: `{ "style": "스타일", "season": "계절" }` 등을 포함할 수 있습니다.
- **유효성 검사**: 위 필드들에 대해 `express-validator`를 사용한 자동 유효성 검사가 적용됩니다. 오류 발생 시 400 상태 코드와 함께 에러 메시지가 반환됩니다.

### 1.3 게시물 수정 (Update Post)

- **Endpoint**: `PUT /api/posts/:postId`
- **Auth**: 필요 (Bearer Token, 작성자 또는 관리자만 가능)
- **Request Body**: 생성 시와 유사하며, 수정하려는 필드만 포함합니다.
    - `postType: 'ootd'`인 게시물의 `images` 수정 시, 빈 배열로 업데이트할 수 없습니다.
    - `additionalFields` 또는 그 하위 필드(`style`, `season` 등)를 수정할 수 있습니다.
- **유효성 검사**: 적용됩니다.

### 1.4 게시물 목록 조회 (Get Posts)

- **Endpoint**: `GET /api/posts`
- **Query Parameters (OOTD 관련 추가/변경)**:
    - `postType` (String): `'ootd'`로 필터링하여 OOTD 게시물만 조회 가능.
    - `style` (String): OOTD 게시물 조회 시 `additionalFields.style` 값으로 필터링. (예: `/api/posts?postType=ootd&style=casual`)
    - `season` (String): OOTD 게시물 조회 시 `additionalFields.season` 값으로 필터링.

--- 