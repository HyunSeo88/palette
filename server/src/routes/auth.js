const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { protect, sendTokenResponse } = require('../middleware/auth');

// 입력 유효성 검사 미들웨어
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('이미 사용 중인 이메일 주소입니다.');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/[\W]/)
    .withMessage('비밀번호는 최소 1개의 특수문자를 포함해야 합니다.'),
  body('nickname')
    .isLength({ min: 2, max: 20 })
    .withMessage('닉네임은 2-20자 사이여야 합니다.')
    .custom(async (value) => {
      const user = await User.findOne({ nickname: value });
      if (user) {
        throw new Error('이미 사용 중인 닉네임입니다.');
      }
      return true;
    }),
  body('colorVisionType')
    .isIn(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'colorWeak'])
    .withMessage('유효하지 않은 색각 유형입니다.')
];

// 회원가입
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { email, password, nickname, colorVisionType, bio } = req.body;

    // 사용자 생성
    const user = await User.create({
      email,
      password,
      nickname,
      colorVisionType,
      bio
    });

    // 토큰 생성 및 응답
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
});

// 로그인
router.post('/login', [
  body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('password').exists().withMessage('비밀번호를 입력해주세요.')
], async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 이메일과 비밀번호 확인
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 모두 입력해주세요.'
      });
    }

    // 사용자 조회 (비밀번호 필드 포함)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    // 토큰 생성 및 응답
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: '로그아웃되었습니다.'
  });
});

// 현재 사용자 정보 조회
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// 비밀번호 변경
router.put('/password', protect, [
  body('currentPassword')
    .exists()
    .withMessage('현재 비밀번호를 입력해주세요.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('새 비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/[\W]/)
    .withMessage('새 비밀번호는 최소 1개의 특수문자를 포함해야 합니다.')
], async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // 현재 비밀번호 확인
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '현재 비밀번호가 일치하지 않습니다.'
      });
    }

    // 새 비밀번호로 업데이트
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: '비밀번호가 변경되었습니다.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;