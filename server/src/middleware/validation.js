const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// 비밀번호 검증 규칙
const passwordRules = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/[A-Z]/)
    .withMessage('비밀번호는 대문자를 포함해야 합니다.')
    .matches(/[a-z]/)
    .withMessage('비밀번호는 소문자를 포함해야 합니다.')
    .matches(/[0-9]/)
    .withMessage('비밀번호는 숫자를 포함해야 합니다.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('비밀번호는 특수문자를 포함해야 합니다.')
];

// 회원가입 검증 규칙
const registerRules = [
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
  ...passwordRules,
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      return true;
    }),
  body('nickname')
    .isLength({ min: 2, max: 30 })
    .withMessage('닉네임은 2-30자 사이여야 합니다.')
    .custom(async (value) => {
      const user = await User.findOne({ nickname: value });
      if (user) {
        throw new Error('이미 사용 중인 닉네임입니다.');
      }
      return true;
    }),
  body('colorVisionType')
    .isIn(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'monochromacy'])
    .withMessage('유효하지 않은 색각 유형입니다.')
];

// 검증 결과 처리 미들웨어
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  registerRules,
  passwordRules,
  validate
}; 