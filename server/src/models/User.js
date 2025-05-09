const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수 입력 항목입니다.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.'],
    select: false,
  },
  nickname: {
    type: String,
    required: [true, '닉네임은 필수 입력 항목입니다.'],
    trim: true,
    minlength: [2, '닉네임은 최소 2자 이상이어야 합니다.'],
    maxlength: [30, '닉네임은 최대 30자까지 가능합니다.'],
  },
  colorVisionType: {
    type: String,
    enum: ['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'monochromacy'],
    default: 'normal',
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  bio: {
    type: String,
    maxlength: [200, '자기소개는 최대 200자까지 가능합니다.'],
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  points: {
    type: Number,
    default: 0
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  provider: {
    type: String,
    required: [true, '가입 방식 정보가 필요합니다.'],
    enum: ['email', 'google', 'kakao'],
    default: 'email',
  },
  socialId: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;