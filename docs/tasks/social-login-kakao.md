---
id: social-login-kakao
title: 카카오 소셜 로그인 기능 구현
status: Completed (Phase 1)
assignee: AI
related_issues:
  - #issue_number (GitHub 이슈 연동 시)
created_date: 2024-08-26 
updated_date: 2024-08-29
version: 1.1
project: Palette Web App
priority: High
---

## 1. 개요 (Overview)

본 문서는 Palette 웹 애플리케이션에 카카오 계정을 사용한 소셜 로그인 기능을 구현하는 작업 명세를 정의합니다. 사용자는 카카오 계정을 통해 간편하게 서비스에 가입하거나 로그인할 수 있습니다.

## 2. 요구사항 (Requirements)

### 2.1. 기능적 요구사항

*   **카카오 계정으로 신규 가입:**
    *   사용자는 카카오 계정 정보를 기반으로 신규 계정을 생성할 수 있어야 합니다.
    *   카카오에서 제공하는 이메일이 있을 경우, 해당 이메일로 계정을 생성합니다.
    *   **카카오에서 이메일 정보를 제공하지 않는 경우 (구현 완료):**
        *   `POST /api/auth/kakao` API는 `intent: 'signup'` 요청 시, `success: false`, `errorCode: 'ACCOUNT_NOT_FOUND_NO_EMAIL'`과 함께 `tempKakaoProfile` (카카오ID, 닉네임, 프로필 이미지) 정보를 반환합니다.
        *   프론트엔드는 이 응답을 받고 사용자를 `/social-email-request` 페이지로 리디렉션하며 `tempKakaoProfile` 정보를 전달합니다.
        *   사용자는 `/social-email-request` 페이지에서 서비스에 사용할 이메일 주소를 입력합니다.
        *   제출 시, 프론트엔드는 `POST /api/auth/kakao/complete-signup` API를 호출하여 `kakaoId`, 사용자가 입력한 `email`, 그리고 `tempKakaoProfile`의 `nickname`, `profileImage`를 전달하여 최종 회원가입을 완료합니다.
    *   신규 가입 (이메일 제공 또는 이메일 입력 완료 후) 시, 카카오 프로필의 닉네임 (없으면 자동 생성)을 기본 닉네임으로 설정합니다.
    *   최종 가입 성공 시, `isNewUserResponse: true`를 반환하여 프론트엔드에서 소셜 온보딩 페이지 (`/social-onboarding`)로 리디렉션합니다.
*   **카카오 계정으로 기존 회원 로그인:**
    *   기존에 카카오로 가입한 사용자는 카카오 계정으로 로그인할 수 있어야 합니다.
    *   `isNewUserResponse: false`를 반환하고 메인 페이지로 리디렉션합니다.
*   **계정 연동 처리:**
    *   **동일 이메일 + 'email' 프로바이더 계정 존재 시:**
        *   카카오 로그인 시도 시 동일한 이메일 주소로 이미 'email' (일반 가입) 계정이 존재할 경우, 자동 연동하지 않고 `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` 에러 코드를 반환합니다.
        *   프론트엔드에서는 "이미 해당 이메일로 가입된 계정이 있습니다. 이메일로 로그인 후 계정 설정에서 카카오 계정을 연동해주세요." 메시지를 표시합니다.
    *   **동일 이메일 + 타 소셜 프로바이더 계정 존재 시 (예: Google):**
        *   카카오 로그인 시도 시 동일한 이메일 주소로 이미 'google' 등 다른 소셜 프로바이더로 가입된 계정이 존재할 경우, 기존 계정에 카카오 소셜 ID를 추가하고 프로바이더 정보를 'kakao'로 업데이트하여 연동합니다 (카카오 우선).
        *   로그인 성공으로 처리하고 `isNewUserResponse: false`를 반환합니다.
*   **카카오 SDK 연동:** 프론트엔드에서 카카오 JavaScript SDK를 사용하여 사용자 인증 및 정보(닉네임, 프로필 사진, 이메일)를 가져옵니다.
*   **에러 처리:** 다양한 로그인 시나리오(API 오류, 사용자 취소 등)에 대한 명확한 에러 메시지를 프론트엔드에 제공합니다.

### 2.2. 비기능적 요구사항

*   보안: OAuth 2.0 표준을 준수하여 안전하게 인증 정보를 처리합니다.
*   사용성: 사용자에게 간편하고 직관적인 로그인 경험을 제공합니다.

## 3. 기술 스택 (Tech Stack)

*   **Backend**: Node.js, Express.js, MongoDB, Mongoose
*   **Frontend**: React, TypeScript, Zustand (for state management), Kakao JavaScript SDK
*   **Authentication**: JWT (JSON Web Tokens)

## 4. API 엔드포인트 (Backend)

*   `POST /api/auth/kakao`
    *   **Request Body (from client):**
        ```json
        {
          "accessToken": "KAKAO_ACCESS_TOKEN",
          "intent": "login" | "signup"
        }
        ```
    *   **Response (Success - New User Signup):**
        ```json
        {
          "token": "JWT_TOKEN",
          "userId": "USER_ID",
          "nickname": "KAKAO_NICKNAME",
          "isNewUserResponse": true,
          "provider": "kakao"
        }
        ```
    *   **Response (Success - Existing User Login):**
        ```json
        {
          "token": "JWT_TOKEN",
          "userId": "USER_ID",
          "nickname": "USER_NICKNAME",
          "isNewUserResponse": false,
          "provider": "kakao"
        }
        ```
    *   **Response (Error - Email account exists, needs manual link):**
        ```json
        {
          "error": "EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK",
          "message": "이미 해당 이메일로 가입된 계정이 존재합니다. 이메일로 로그인 후 계정 설정에서 카카오 계정을 연동해주세요."
        }
        ```
    *   **Response (Error - Kakao account has no email, intent: 'signup'):**
        ```json
        {
          "success": false,
          "errorCode": "ACCOUNT_NOT_FOUND_NO_EMAIL",
          "message": "카카오 계정에 연결된 이메일 정보가 없습니다. 서비스 가입을 위해 이메일 정보를 입력해주세요.",
          "tempKakaoProfile": {
            "kakaoId": "KAKAO_SOCIAL_ID",
            "nickname": "KAKAO_NICKNAME_FROM_PROFILE",
            "profileImage": "KAKAO_PROFILE_IMAGE_URL"
          }
        }
        ```
    *   기타 에러 코드 (예: `INVALID_KAKAO_TOKEN`, `KAKAO_API_ERROR`, `USER_NOT_FOUND` 등)

## 5. 프론트엔드 구현 (Frontend Implementation)

*   **`client/src/components/auth/SocialLogin.tsx`**:
    *   카카오 로그인 버튼 UI 추가.
    *   카카오 JavaScript SDK 초기화 (`Kakao.init(REACT_APP_KAKAO_JS_KEY)`).
    *   `Kakao.Auth.login` 함수를 사용하여 사용자 동의를 받고 액세스 토큰을 요청합니다. (scope: `profile_nickname`, `profile_image`, `account_email`)
    *   `Kakao.API.request({ url: '/v2/user/me' })`를 사용하여 사용자 정보를 가져옵니다.
    *   가져온 액세스 토큰과 `intent` 값을 백엔드 `/api/auth/kakao`로 전송합니다.
    *   `processSocialLoginResult` 함수에서 백엔드 응답을 처리:
        *   성공 시: `isNewUserResponse` 값에 따라 `/social-onboarding` 또는 메인 페이지로 리디렉션.
        *   `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` 에러 시: 알림 메시지 표시.
        *   `ACCOUNT_NOT_FOUND_NO_EMAIL` 에러 시: `/social-email-request` 페이지로 리디렉션 (해당 페이지 및 로직은 별도 Task로 구현 예정).
        *   기타 에러: 사용자에게 적절한 알림 표시.
*   **`client/.env`**: `REACT_APP_KAKAO_JS_KEY` 환경 변수 설정.
*   **`client/public/index.html`**: 카카오 SDK 로드를 위한 스크립트 태그 추가 (또는 동적 로드).
    ```html
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js" integrity="sha384-YOUR_INTEGRITY_HASH" crossorigin="anonymous"></script>
    ```
    (주의: integrity hash는 실제 SDK 버전에 맞게 확인 필요)

## 6. 주요 로직 (Key Logic - Backend `kakaoLogin` Controller)

1.  **토큰 및 사용자 정보**: 클라이언트에서 받은 `accessToken`을 사용하여 카카오 API 서버로부터 사용자 정보 (`id`, `kakao_account.profile.nickname`, `kakao_account.profile.profile_image_url`, `kakao_account.email`)를 조회합니다.
2.  **기존 사용자 확인 (by `socialId`):** `provider: 'kakao'` 이고 `socialId`가 일치하는 사용자가 있는지 확인합니다.
    *   존재하면 로그인 성공. `isNewUserResponse: false`.
3.  **기존 사용자 확인 (by `email` - `intent: 'login'` 시):**
    *   카카오에서 이메일을 제공한 경우, 해당 이메일로 가입된 사용자가 있는지 확인합니다.
    *   **Case 1: `provider: 'email'` 계정 발견:**
        *   `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` 에러 반환. 자동 연동하지 않음.
    *   **Case 2: `provider: 'google'` (또는 다른 소셜) 계정 발견:**
        *   해당 계정에 `socialId` (카카오 ID)와 `provider: 'kakao'`를 업데이트하여 연동 (카카오 우선). 로그인 성공. `isNewUserResponse: false`.
4.  **신규 사용자 처리 (`intent: 'signup'` 또는 위에서 사용자를 찾지 못한 경우):**
    *   **카카오 이메일이 없는 경우:**
        *   `ACCOUNT_NOT_FOUND_NO_EMAIL` 에러와 함께 임시 프로필 정보 반환. 프론트에서 별도 이메일 입력 처리 필요.
    *   **카카오 이메일이 있는 경우:**
        *   해당 이메일로 이미 가입된 계정(`provider: 'email'` 또는 `provider: 'google'`)이 있는지 다시 확인 (중복 가입 방지).
            *   `provider: 'email'` 계정 발견: `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` 반환.
            *   `provider: 'google'` 계정 발견: 카카오 정보로 연동 (기존 계정 업데이트), 로그인 성공. `isNewUserResponse: false`.
            *   완전히 새로운 사용자: 신규 계정 생성.
                *   `nickname`: 카카오 닉네임 사용. 없으면 자동 생성 (예: `User_kakao_{socialId}`).
                *   `email`: 카카오 제공 이메일.
                *   `provider`: 'kakao'.
                *   `socialId`: 카카오 ID.
                *   `password`: 자동 생성 (소셜 로그인이므로 직접 사용 안 함).
                *   `isEmailVerified`: true (카카오가 이메일 소유권을 확인했다고 가정).
                *   `isNewUserResponse: true`.
5.  JWT 토큰 발급 및 반환.

## 7. 추후 고려사항 (Future Considerations)

*   `/social-email-request` 페이지 및 관련 로직 구현: 카카오에서 이메일을 제공하지 않는 사용자를 위한 이메일 입력 및 검증 프로세스.
*   계정 설정 페이지에 수동 계정 연동/해제 기능.
*   카카오 로그인 토큰 만료 및 갱신 처리.
*   카카오 API 에러 코드 상세 분류 및 사용자 메시지 개선.
*   회원 탈퇴 시 관련 데이터 처리 정책 구체화 (게시물, 댓글 등).
*   구글 자동 로그인 현상 개선 검토.

## 8. 결정 사항 (Decisions Made)

*   신규 가입 시, 카카오 닉네임이 없을 경우 `User_kakao_{socialId}` 형식 대신 실제 카카오 프로필 닉네임을 우선 사용하도록 수정됨. (기존 `googleLogin` 로직과 일부 차이)
*   이메일 프로바이더로 가입된 동일 이메일 계정 존재 시, 자동 연동 대신 수동 연동을 유도하기로 결정 (보안 및 사용자 선택 존중).
*   타 소셜 프로바이더(Google)로 가입된 동일 이메일 계정 존재 시, 카카오 정보로 업데이트하며 연동 (카카오 우선).

## 9. 테스트 케이스 (Test Cases) - 주요 시나리오

*   [TC1] 신규 사용자, 카카오 가입 (이메일 제공 동의) -> `/social-onboarding` 리디렉션
*   **[TC2 수정]** 신규 사용자, 카카오 가입 (이메일 제공 미동의 또는 이메일 없음) -> `ACCOUNT_NOT_FOUND_NO_EMAIL` 수신 -> `/social-email-request` 리디렉션.
    *   [TC2-1] `/social-email-request`에서 유효한 새 이메일 입력 -> 가입 성공 -> `/social-onboarding` 리디렉션.
    *   [TC2-2] `/social-email-request`에서 이미 사용 중인 이메일 입력 -> `EMAIL_ALREADY_EXISTS` 에러 메시지 표시.
*   [TC3] 기존 카카오 사용자 로그인 -> 메인 페이지 리디렉션
*   [TC4] 동일 이메일 + 'email' 가입자, 카카오 로그인 시도 -> "수동 연동 필요" 메시지
*   [TC5] 동일 이메일 + 'google' 가입자, 카카오 로그인 시도 -> 카카오 계정으로 연동 및 로그인 성공
*   [TC6] 유효하지 않은 카카오 토큰으로 API 호출 -> 에러 메시지

--- 