const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 저장될 디렉토리 경로 (아바타용)
const AVATAR_UPLOAD_DIR = 'server/public/uploads/avatars/';

// 디렉토리가 없으면 생성
if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

// Multer 디스크 스토리지 설정 (아바타용)
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // 사용자 ID와 타임스탬프를 조합하여 파일명 생성 (덮어쓰기 및 유일성 확보)
    const userId = req.user ? req.user.id : 'unknown_user';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 파일 필터링 함수 (이미지 파일만 허용)
const avatarFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP images are allowed for avatars.'), false);
  }
};

// Multer 업로드 인스턴스 생성 (아바타용)
const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB 파일 크기 제한 (아바타는 작게)
  },
  fileFilter: avatarFileFilter
});

module.exports = avatarUpload; 