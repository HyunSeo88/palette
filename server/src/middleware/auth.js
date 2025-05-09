const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'TOKEN_MISSING',
        message: '인증 토큰이 필요합니다.' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 사용자 존재 여부 확인
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: '유효하지 않은 사용자입니다.'
        });
      }

      // 이메일 인증 여부 확인
      if (!user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          error: 'EMAIL_NOT_VERIFIED',
          message: '이메일 인증이 필요합니다.'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'TOKEN_EXPIRED',
          message: '인증 토큰이 만료되었습니다.'
        });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'TOKEN_INVALID',
          message: '유효하지 않은 토큰입니다.'
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'SERVER_ERROR',
      message: '인증 처리 중 오류가 발생했습니다.' 
    });
  }
};

// 관리자 권한 확인 미들웨어
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '이 작업을 수행할 권한이 없습니다.'
      });
    }
    next();
  };
};

// 토큰 생성 유틸리티 함수
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// 토큰 응답 유틸리티 함수 수정
const sendTokenResponse = (user, statusCode, res, isNewUserParam = false) => {
  const token = exports.generateToken(user);
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const responseData = {
    success: true,
    token,
    refreshToken,
    isNewUser: !!isNewUserParam
  };

  res.status(statusCode).json(responseData);
};

module.exports = { 
  auth,
  generateToken: exports.generateToken,
  sendTokenResponse,
  authorize: exports.authorize
};