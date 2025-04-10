const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: '인증이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
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

// 토큰 응답 유틸리티 함수
const sendTokenResponse = (user, statusCode, res) => {
  const token = exports.generateToken(user);
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken
  });
};

module.exports = { 
  auth,
  generateToken: exports.generateToken,
  sendTokenResponse,
  authorize: exports.authorize
};