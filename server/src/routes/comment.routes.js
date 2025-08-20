const express = require('express');
// Express 라우터의 mergeParams 옵션을 true로 설정해야 부모 라우터의 파라미터(예: :postId)를 사용할 수 있습니다.
const router = express.Router({ mergeParams: true }); 
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware'); // 공통 인증 미들웨어 사용

// @route   POST /api/posts/:postId/comments 
//          (이 라우트는 server/src/index.js 또는 상위 라우터에서 /api/posts/:postId 경로와 병합되어야 함)
// @desc    Create a new comment on a specific post
// @access  Private
router.post('/', authMiddleware, commentController.createComment);

// @route   GET /api/posts/:postId/comments
// @desc    Get all comments for a specific post
// @access  Public
router.get('/', commentController.getCommentsByPostId);

// @route   PUT /api/posts/:postId/comments/:commentId 
//          (comment.routes.js 파일 내에서는 /:commentId 로 정의)
// @desc    Update a specific comment
// @access  Private (Author or Admin)
router.put('/:commentId', authMiddleware, commentController.updateComment);

// @route   DELETE /api/posts/:postId/comments/:commentId
//          (comment.routes.js 파일 내에서는 /:commentId 로 정의)
// @desc    Delete a specific comment (Soft delete)
// @access  Private (Author or Admin)
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

// @route   POST /api/posts/:postId/comments/:commentId/like
//          (comment.routes.js 파일 내에서는 /:commentId/like 로 정의)
// @desc    Like/Unlike a specific comment
// @access  Private
router.post('/:commentId/like', authMiddleware, commentController.toggleLikeComment);

module.exports = router; 