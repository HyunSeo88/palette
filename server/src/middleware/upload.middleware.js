const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 저장될 디렉토리 경로
const UPLOAD_DIR = 'server/public/uploads/posts/';

// 디렉토리가 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer 디스크 스토리지 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 피하기 위해 타임스탬프와 원본 파일명 조합
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 파일 필터링 함수 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP images are allowed.'), false);
  }
};

// Multer 업로드 인스턴스 생성
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 파일 크기 제한
  },
  fileFilter: fileFilter
});

module.exports = upload; 