const User = require('../models/User');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken'); // jwt 직접 사용 제거
const { sendVerificationEmail } = require('../utils/email');
const { sendTokenResponse } = require('../middleware/auth'); // sendTokenResponse 임포트
const { OAuth2Client } = require('google-auth-library'); // Google 라이브러리 추가
const axios = require('axios'); // axios 추가
const { getSocialUserInfo, processSocialLogin, completeKakaoSignup: completeKakaoSignupHelper } = require('./authHelper'); // 수정: 헬퍼 함수 임포트

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT 토큰 생성 함수 제거 (sendTokenResponse가 처리)
// const generateToken = (id, expiresIn) => { ... };

// 회원가입 컨트롤러
exports.register = async (req, res, next) => {
  console.log('[Server Register] Request received.'); // 시작 로그
  try {
    const { email, password, nickname, colorVisionType, bio } = req.body;
    const requiresVerification = (process.env.REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() === 'true';
    console.log(`[Server Register] requiresVerification: ${requiresVerification}`);

    console.log('[Server Register] Attempting User.create...');
    const user = await User.create({
      email,
      password,
      nickname,
      colorVisionType,
      bio,
      isEmailVerified: !requiresVerification
    });
    console.log('[Server Register] User.create successful. User ID:', user._id);

    if (requiresVerification) {
      console.log('[Server Register] Email verification required path.');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
      
      console.log('[Server Register] Attempting user.save (with verification token)...');
      await user.save({ validateBeforeSave: false });
      console.log('[Server Register] user.save successful.');

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      try {
        console.log('[Server Register] Attempting sendVerificationEmail...');
        await sendVerificationEmail(user.email, verificationUrl);
        console.log('[Server Register] sendVerificationEmail successful.');
        
        console.log('[Server Register] Sending requiresVerification response.');
        res.status(201).json({
          success: true,
          message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
          data: { requiresVerification: true, email: user.email }
        });
      } catch (error) {
        console.error('[Server Register] sendVerificationEmail failed:', error);
         user.emailVerificationToken = undefined;
         user.emailVerificationExpires = undefined;
         console.log('[Server Register] Attempting user.save (after email error)...');
         await user.save({ validateBeforeSave: false });
         console.log('[Server Register] user.save successful (after email error).');
         
         console.log('[Server Register] Sending email error response.');
         res.status(201).json({
             success: true,
             message: '회원가입은 완료되었으나 인증 메일 발송에 실패했습니다. 관리자에게 문의하거나 재전송을 시도해주세요.',
             data: { requiresVerification: true, emailError: true, email: user.email }
         });
      }
    } else {
      console.log('[Server Register] Immediate login path.');
      console.log('[Server Register] Attempting sendTokenResponse...');
      // sendTokenResponse 유틸리티 사용하여 토큰 응답 전송
      sendTokenResponse(user, 201, res);
      console.log('[Server Register] sendTokenResponse called.'); // sendTokenResponse는 내부적으로 res.json을 호출하므로 이 로그는 실제 응답 전송 직전에 찍힘
    }

  } catch (error) {
    console.error('[Server Register] Error caught:', error);
    if (error.code === 11000) {
      // 중복 키 오류 처리
      const field = Object.keys(error.keyPattern)[0];
       console.log(`[Server Register] Duplicate key error for field: ${field}`);
      return res.status(400).json({
        success: false,
        message: `이미 사용 중인 ${field === 'email' ? '이메일' : '닉네임'}입니다.`
      });
    }
     console.log('[Server Register] Passing error to next middleware.');
    next(error);
  }
};

// 이메일 인증 컨트롤러 수정
exports.verifyEmail = async (req, res, next) => {
  console.log('[Server VerifyEmail] Request received:', req.body);
  try {
    // 토큰을 req.body에서 가져옴
    const { token } = req.body;

    if (!token) {
      console.log('[Server VerifyEmail] Error: No token provided');
      return res.status(400).json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      });
    }

    console.log('[Server VerifyEmail] Token received:', token);
    // 원본 토큰으로 해시 생성 (DB와 비교하기 위해)
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    console.log('[Server VerifyEmail] Hashed token:', emailVerificationToken);

    // 토큰으로 사용자 찾기 (만료 시간 확인 포함)
    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      // DB 상태를 로그로 확인
      const anyUserWithToken = await User.findOne({
        emailVerificationToken
      });
      
      if (anyUserWithToken) {
        console.log('[Server VerifyEmail] Token found but expired. Expiry:', anyUserWithToken.emailVerificationExpires, 'Current time:', Date.now());
        return res.status(400).json({
          success: false,
          message: '만료된 인증 토큰입니다. 인증 이메일을 재발송해주세요.'
        });
      } else {
        console.log('[Server VerifyEmail] No user found with this token');
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 인증 토큰입니다. 인증 이메일을 재발송해주세요.'
        });
      }
    }

    console.log('[Server VerifyEmail] User found:', user._id);
    // 이메일 인증 완료 처리
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    console.log('[Server VerifyEmail] Email verification successful for user:', user._id);

    // Do not send tokens. Just confirm success.
    res.status(200).json({
      success: true,
      message: '이메일 인증이 성공적으로 완료되었습니다. 이제 로그인 페이지에서 로그인해주세요.'
    });

  } catch (error) {
    console.error('[Server VerifyEmail] Error caught:', error);
    next(error); // 에러 처리 미들웨어로 전달
  }
};

// Google 로그인 컨트롤러 (리팩토링)
exports.googleLogin = async (req, res, next) => {
  const { token, intent } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Google ID 토큰이 필요합니다.' }); // 클라이언트에게는 여전히 "Google ID 토큰"이라고 안내해도 무방 (또는 "Google 토큰")
  }
  if (!intent || !['login', 'signup', 'link'].includes(intent)) {
    return res.status(400).json({ success: false, message: "로그인, 회원가입 또는 계정연동 의도가 명확해야 합니다. (intent: 'login', 'signup', or 'link')" });
  }
  console.log(`[GoogleLogin Controller] Received Google token with intent: ${intent}. User from middleware: ${req.user ? req.user.id : 'None'}`);

  try {
    const socialProfile = await getSocialUserInfo('google', token);
    await processSocialLogin(socialProfile, intent, req, res, next);
  } catch (error) {
    console.error('[GoogleLogin Controller] Error caught:', error.message); // Log the actual error message

    // getSocialUserInfo에서 발생시킨 특정 오류 메시지들을 확인
    if (error.message.includes('Google 토큰이 유효하지 않거나 만료되었습니다') || 
        error.message.includes('Google 사용자 정보 조회에 실패했거나 필수 정보(ID)가 없습니다') ||
        error.message.includes('Google API에서 응답을 받지 못했습니다') ||
        error.message.includes('Google API 요청 설정 중 오류가 발생했습니다') ||
        error.message.includes('Google API 오류:')) { // 일반적인 Google API 오류 포함
        return res.status(401).json({ 
          success: false, 
          message: error.message, // getSocialUserInfo에서 생성된 구체적인 메시지 사용
          errorCode: 'INVALID_GOOGLE_TOKEN_OR_INFO' 
        });
    }
    // 이전에 사용하던 일반적인 토큰 오류 메시지 (참고용, 위의 조건에서 대부분 처리될 것임)
    // if (error.message.includes('Token used too late') || 
    //     error.message.includes('Invalid token signature') || 
    //     error.message.includes('Audience mismatch') ||
    //     error.message.includes('Google 토큰 검증에 실패했습니다')) {
    //     return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 Google 토큰입니다.', errorCode: 'INVALID_GOOGLE_TOKEN' });
    // }
    
    // 그 외 예상치 못한 오류는 다음 에러 핸들러로 전달 (500 오류 유발 가능)
    next(error); 
  }
};

// Kakao 로그인 컨트롤러 (리팩토링)
exports.kakaoLogin = async (req, res, next) => {
  const { token: kakaoAccessToken, intent } = req.body;

  if (!kakaoAccessToken) {
    return res.status(400).json({ success: false, message: 'Kakao 액세스 토큰이 필요합니다.' });
  }
  if (!intent || !['login', 'signup', 'link'].includes(intent)) {
    return res.status(400).json({ success: false, message: "로그인, 회원가입 또는 계정연동 의도가 명확해야 합니다. (intent: 'login', 'signup', or 'link')" });
  }
  console.log(`[KakaoLogin Controller] Received Kakao token with intent: ${intent}. User from middleware: ${req.user ? req.user.id : 'None'}`);

  try {
    const socialProfile = await getSocialUserInfo('kakao', kakaoAccessToken);
    await processSocialLogin(socialProfile, intent, req, res, next);
  } catch (error) {
    console.error('[KakaoLogin Controller] Error caught during getSocialUserInfo or initial processing:', error.response ? error.response.data : error.message);
    if (error.message.includes('Kakao 사용자 정보를 가져오는데 실패했습니다')) { 
        return res.status(500).json({ success: false, message: 'Kakao 사용자 정보 조회에 실패했습니다.', errorCode: 'KAKAO_API_ERROR' });
    }
    if (error.isAxiosError && error.response?.status === 401 && error.response?.data?.code === -401) { 
      return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 Kakao 토큰입니다.', errorCode: 'INVALID_KAKAO_TOKEN' });
    }
    if (error.isAxiosError && error.response) { 
        return res.status(error.response.status || 500).json({ success: false, message: error.response.data?.msg || '카카오 API 요청 중 오류 발생', errorCode: 'KAKAO_API_ERROR' });
    }
    next(error);
  }
};

// 신규: Kakao 이메일 입력 후 가입 완료 컨트롤러
exports.completeKakaoSignup = async (req, res, next) => {
  const { kakaoId, email, nickname, profileImage } = req.body;
  console.log(`[CompleteKakaoSignup Controller] Received data - kakaoId: ${kakaoId}, email: ${email}`);

  // 유효성 검사는 authHelper의 함수에서 수행하므로 여기서는 바로 호출
  try {
    await completeKakaoSignupHelper({ kakaoId, email, nickname, profileImage }, res, next);
  } catch (error) {
    // authHelper에서 next(error)를 호출하므로, 여기까지 오면 일반적인 Express 오류 처리기에 의해 처리됨
    // 하지만 명시적으로 next를 호출해주는 것이 안전할 수 있음.
    console.error('[CompleteKakaoSignup Controller] Error during helper call:', error);
    next(error); 
  }
};

// 기존 코드 복사 시작
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: '이메일 주소가 필요합니다.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: '해당 이메일로 가입된 사용자를 찾을 수 없습니다.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: '이미 인증된 이메일입니다.' });
    }

    // 이전 토큰이 만료되지 않았어도 새 토큰 발급 (선택적: 만료 검사 후 재사용 또는 새 발급)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24시간 유효
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    try {
      await sendVerificationEmail(user.email, verificationUrl);
      res.status(200).json({ success: true, message: '인증 이메일을 재발송했습니다. 이메일함을 확인해주세요.' });
    } catch (emailError) {
      console.error('[Server ResendVerificationEmail] sendVerificationEmail failed:', emailError);
      // 토큰 저장한 것을 롤백할 필요는 없음. 사용자는 다시 시도할 수 있음.
      return res.status(500).json({ success: false, message: '인증 이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }

  } catch (error) {
    console.error('[Server ResendVerificationEmail] Error caught:', error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: '잘못된 이메일 또는 비밀번호입니다.', errorCode: 'INVALID_CREDENTIALS' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '잘못된 이메일 또는 비밀번호입니다.', errorCode: 'INVALID_CREDENTIALS' });
    }
    
    if (!user.isEmailVerified && (process.env.REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() === 'true') {
        return res.status(401).json({
            success: false,
            message: '이메일 인증이 필요합니다. 먼저 이메일 인증을 완료해주세요.',
            errorCode: 'EMAIL_NOT_VERIFIED'
        });
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  // 클라이언트 측에서 토큰을 삭제하므로 서버에서는 특별한 작업 불필요.
  // 필요시 블랙리스트 구현 가능.
  res.status(200).json({ success: true, message: '로그아웃 되었습니다.' });
};

exports.me = async (req, res, next) => {
  // req.user는 authenticate 미들웨어에서 설정됨
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
    // 이메일 미인증 사용자의 /me 접근 차단 (선택적, 이미 로그인 시점에 체크할 수도 있음)
    if (!user.isEmailVerified && (process.env.REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() === 'true') {
      return res.status(401).json({
          success: false,
          message: '이메일 인증이 필요합니다.',
          errorCode: 'EMAIL_NOT_VERIFIED'
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
    // 비밀번호 재설정 로직 (추후 구현)
    res.status(501).json({ success: false, message: '아직 구현되지 않은 기능입니다.' });
};

exports.resetPassword = async (req, res, next) => {
    // 비밀번호 재설정 로직 (추후 구현)
    res.status(501).json({ success: false, message: '아직 구현되지 않은 기능입니다.' });
};

exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: '현재 비밀번호와 새 비밀번호를 모두 입력해야 합니다.' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
        }

        user.password = newPassword;
        await user.save();

        // Optionally, re-issue tokens or just confirm success
        sendTokenResponse(user, 200, res); // Re-issuing tokens can be good practice

    } catch (error) {
        next(error);
    }
};

// 신규: 회원 탈퇴 컨트롤러
exports.deleteAccount = async (req, res, next) => {
  const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID
  const { password } = req.body; // 비밀번호 재확인용 (이메일 사용자)

  console.log(`[DeleteAccount Controller] Attempting to delete account for user ID: ${userId}`);

  try {
    const user = await User.findById(userId).select('+password'); // 비밀번호 필드 포함 조회

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.', errorCode: 'USER_NOT_FOUND' });
    }

    // 1. 이메일 가입 사용자의 경우 비밀번호 확인
    if (user.provider === 'email') {
      if (!password) {
        return res.status(400).json({ success: false, message: '계정 삭제를 위해 비밀번호를 입력해주세요.', errorCode: 'PASSWORD_REQUIRED' });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.', errorCode: 'INVALID_PASSWORD' });
      }
    }

    // 2. 소셜 연동 해제 (카카오 예시 - 어드민 키 사용)
    if (user.provider === 'kakao' && user.socialId) {
      try {
        const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
        if (KAKAO_ADMIN_KEY) {
          console.log(`[DeleteAccount Controller] Attempting to unlink Kakao account for user socialId: ${user.socialId}`);
          await axios.post('https://kapi.kakao.com/v1/user/unlink', 
            `target_id_type=user_id&target_id=${user.socialId}`,
            {
              headers: {
                'Authorization': `KakaoAK ${KAKAO_ADMIN_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
              }
            }
          );
          console.log(`[DeleteAccount Controller] Kakao account unlinked successfully for socialId: ${user.socialId}`);
        } else {
          console.warn('[DeleteAccount Controller] KAKAO_ADMIN_KEY is not set. Skipping Kakao unlink.');
        }
      } catch (kakaoError) {
        // 카카오 연동 해제 실패가 전체 탈퇴를 막을 필요는 없음. 오류 로깅만.
        console.error('[DeleteAccount Controller] Failed to unlink Kakao account:', kakaoError.response ? kakaoError.response.data : kakaoError.message);
      }
    }
    // Google의 경우, 서버에서 직접 연동 해제가 복잡하므로 사용자에게 안내하는 것이 일반적.
    // 필요시 Google API를 사용하여 토큰을 revoke 할 수 있지만, 현재 access_token을 저장하고 있지 않음.

    // 3. 데이터베이스에서 사용자 삭제
    await User.findByIdAndDelete(userId);
    console.log(`[DeleteAccount Controller] User account deleted successfully from DB for user ID: ${userId}`);

    // 4. 성공 응답 (클라이언트에서는 이 응답을 받고 로그아웃 처리)
    res.status(200).json({ success: true, message: '회원 탈퇴가 성공적으로 처리되었습니다.' });

  } catch (error) {
    console.error('[DeleteAccount Controller] Error caught:', error);
    next(error);
  }
}; 