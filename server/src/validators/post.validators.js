const { body, param } = require('express-validator');
const Post = require('../models/Post.model'); // Post 모델 경로에 맞게 수정

const POST_TYPES = ['fashion', 'free', 'qna', 'market', 'groupbuy', 'ootd'];
const POST_STATUSES = ['published', 'draft', 'pending_review', 'deleted', 'archived'];

const validatePostId = [
    param('postId').isMongoId().withMessage('Invalid Post ID format.'),
];

const createPostValidationRules = [
    body('postType')
        .isIn(POST_TYPES).withMessage(`Post type must be one of: ${POST_TYPES.join(', ')}`),
    body('title')
        .notEmpty().withMessage('Title is required.')
        .isString().withMessage('Title must be a string.')
        .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters.'),
    body('content') // content는 postType에 따라 다르게 처리될 수 있으므로, 컨트롤러에서 추가 검증
        .isString().withMessage('Content must be a string.'),
    body('images')
        .optional()
        .isArray().withMessage('Images must be an array.')
        .custom((value, { req }) => {
            if (req.body.postType === 'ootd' && (!value || value.length === 0)) {
                throw new Error('At least one image is required for OOTD posts.');
            }
            return true;
        }),
    body('images.*') // 각 이미지 URL 유효성 (선택적)
        .optional()
        .isURL().withMessage('Each image must be a valid URL.'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array.'),
    body('tags.*')
        .optional()
        .isString().withMessage('Each tag must be a string.'),
    body('status')
        .optional()
        .isIn(POST_STATUSES).withMessage(`Status must be one of: ${POST_STATUSES.join(', ')}`),
    body('additionalFields')
        .optional()
        .isObject().withMessage('Additional fields must be an object.'),
    // OOTD 특정 필드 검증 (postType이 'ootd'일 때)
    body('additionalFields.style')
        .if(body('postType').equals('ootd'))
        .optional()
        .isString().withMessage('Style must be a string.'),
    body('additionalFields.season')
        .if(body('postType').equals('ootd'))
        .optional()
        .isString().withMessage('Season must be a string.'),
    // OOTD의 content(caption) 길이 제한은 모델에 따르지만, 여기서도 명시 가능
    body('content')
        .if(body('postType').equals('ootd'))
        .isLength({ max: 500 }).withMessage('Caption (content) for OOTD cannot be more than 500 characters.'),
];

const updatePostValidationRules = [
    param('postId').isMongoId().withMessage('Invalid Post ID format.'),
    body('postType')
        .optional()
        .isIn(POST_TYPES).withMessage(`Post type must be one of: ${POST_TYPES.join(', ')}`),
    body('title')
        .optional()
        .notEmpty().withMessage('Title cannot be empty if provided.')
        .isString().withMessage('Title must be a string.')
        .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters.'),
    body('content')
        .optional()
        .isString().withMessage('Content must be a string.'),
    body('images')
        .optional()
        .isArray().withMessage('Images must be an array.')
        .custom(async (value, { req }) => {
            // OOTD 게시물 수정 시 images 필드가 오면 빈 배열이 아니어야 함
            const post = await Post.findById(req.params.postId);
            if (post && post.postType === 'ootd' && value && value.length === 0) {
                throw new Error('At least one image is required when updating images for OOTD posts.');
            }
            return true;
        }),
    body('images.*').optional().isURL().withMessage('Each image must be a valid URL.'),
    body('tags').optional().isArray().withMessage('Tags must be an array.'),
    body('tags.*').optional().isString().withMessage('Each tag must be a string.'),
    body('status').optional().isIn(POST_STATUSES).withMessage(`Status must be one of: ${POST_STATUSES.join(', ')}`),
    body('additionalFields').optional().isObject().withMessage('Additional fields must be an object.'),
    body('additionalFields.style')
        .if(body('postType').custom(async (value, { req }) => {
            const post = await Post.findById(req.params.postId);
            return post && post.postType === 'ootd';
        }))
        .optional()
        .isString().withMessage('Style must be a string.'),
    body('additionalFields.season')
         .if(body('postType').custom(async (value, { req }) => {
            const post = await Post.findById(req.params.postId);
            return post && post.postType === 'ootd';
        }))
        .optional()
        .isString().withMessage('Season must be a string.'),
    body('content')
        .if(body('postType').custom(async (value, { req }) => {
            const post = await Post.findById(req.params.postId);
            return post && post.postType === 'ootd';
         }))
        .optional()
        .isLength({ max: 500 }).withMessage('Caption (content) for OOTD cannot be more than 500 characters.')
];

module.exports = {
    createPostValidationRules,
    updatePostValidationRules,
    validatePostId,
}; 