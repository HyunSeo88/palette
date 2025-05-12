const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일 주소를 입력해주세요.'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      '유효한 이메일 주소를 입력해주세요.',
    ],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.'],
    select: false,
  },
  nickname: {
    type: String,
    required: [true, '닉네임을 입력해주세요.'],
    unique: true,
    minlength: [2, '닉네임은 2자 이상, 30자 이하로 입력해주세요.'],
    maxlength: [30, '닉네임은 2자 이상, 30자 이하로 입력해주세요.'],
    trim: true,
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
    maxlength: [150, '자기소개는 최대 150자까지 입력 가능합니다.'],
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
  passwordResetToken: String,
  passwordResetExpires: Date,

  provider: {
    type: String,
    required: true,
    enum: ['email', 'google', 'kakao'],
    default: 'email',
  },
  socialLinks: [
    {
      provider: {
        type: String,
        required: true,
        enum: ['google', 'kakao'],
      },
      socialId: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      nickname: String,
      profileImage: String,
      isVerified: Boolean,
      linkedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
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