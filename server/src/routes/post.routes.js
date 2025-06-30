const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validateCreatePost, validateUpdatePost } = require('../middleware/validators/post.validator');

// @route   GET /api/posts/top-ootd
// @desc    Get weekly top OOTD posts (최근 7일간 좋아요가 많은 상위 10개)
// @access  Public
// 주의: 이 라우트는 /api/posts/:postId 보다 위에 있어야 함 (라우트 우선순위)
router.get('/top-ootd', postController.getWeeklyTopOotd);

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
    '/',
    authMiddleware,
    upload.array('images', 5),
    validateCreatePost,
    postController.createPost
);

// @route   GET /api/posts
// @desc    Get all published posts (with pagination, filtering, sorting)
// @access  Public
router.get('/', postController.getPosts);

// @route   GET /api/posts/:postId
// @desc    Get a single post by ID and increment view count
// @access  Public
router.get(
    '/:postId',
    postController.getPostById
);

// @route   POST /api/posts/:postId/like
// @desc    Like/Unlike a specific post
// @access  Private
router.post(
    '/:postId/like',
    authMiddleware,
    postController.toggleLikePost
);

// @route   PUT /api/posts/:postId
// @desc    Update a specific post
// @access  Private (Author or Admin)
router.put(
    '/:postId',
    authMiddleware,
    upload.array('images', 5),
    postController.updatePost
);

// @route   DELETE /api/posts/:postId
// @desc    Delete a specific post (Soft delete)
// @access  Private (Author or Admin)
router.delete(
    '/:postId',
    authMiddleware,
    postController.deletePost
);

// 다른 라우트들 추가 예정 (댓글 관련 라우트는 별도 파일)

module.exports = router; 