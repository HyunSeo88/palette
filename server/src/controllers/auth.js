const User = require('../models/User');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken'); // jwt 직접 사용 제거
const { sendVerificationEmail } = require('../utils/email');
const { sendTokenResponse } = require('../middleware/auth'); // sendTokenResponse 임포트

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
  try {
    // 토큰을 req.body에서 가져옴
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      });
    }

    // 원본 토큰으로 해시 생성 (DB와 비교하기 위해)
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 토큰으로 사용자 찾기 (만료 시간 확인 포함)
    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      // 해당 토큰을 가진 사용자가 없거나 만료된 경우
      return res.status(400).json({
        success: false,
        message: '유효하지 않거나 만료된 인증 토큰입니다.'
      });
    }

    // 이메일 인증 완료 처리
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // 로그인과 동일하게 토큰 응답 전송
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('[Server VerifyEmail] Error caught:', error);
    next(error); // 에러 처리 미들웨어로 전달
  }
}; 