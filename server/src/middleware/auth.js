const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Authorization 헤더에서 토큰 추출
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 쿠키에서 토큰 추출 (옵션)
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // 토큰이 없는 경우
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '이 리소스에 접근하기 위해서는 로그인이 필요합니다.'
      });
    }

    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 정보 조회
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '토큰에 해당하는 사용자가 존재하지 않습니다.'
        });
      }

      // 요청 객체에 사용자 정보 추가
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
  } catch (error) {
    next(error);
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
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// 토큰을 쿠키에 저장하는 유틸리티 함수
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = this.generateToken(user);

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  // HTTPS를 사용하는 경우에만 secure 옵션 추가
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};