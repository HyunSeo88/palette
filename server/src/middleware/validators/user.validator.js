const { query, body, validationResult } = require('express-validator');

const POST_TYPE_ENUM = ['fashion', 'free', 'qna', 'market', 'groupbuy', 'ootd'];
const SORT_BY_FIELDS = ['createdAt', 'viewCount', 'likesCount', 'commentsCount']; // 허용되는 정렬 필드

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateGetMyPageData = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100.')
        .toInt(),
    query('sortBy')
        .optional()
        .isString().withMessage('SortBy must be a string.')
        .custom(value => {
            const parts = value.split('_');
            if (parts.length !== 2) {
                throw new Error('SortBy must be in format field_direction (e.g., createdAt_desc).');
            }
            if (!SORT_BY_FIELDS.includes(parts[0])) {
                throw new Error(`Invalid sort field. Allowed fields: ${SORT_BY_FIELDS.join(', ')}`);
            }
            if (!['asc', 'desc'].includes(parts[1].toLowerCase())) {
                throw new Error('Sort direction must be asc or desc.');
            }
            return true;
        }),
    query('postType')
        .optional()
        .isString().withMessage('PostType must be a string.')
        .isIn(POST_TYPE_ENUM).withMessage(`PostType must be one of: ${POST_TYPE_ENUM.join(', ')}`),
    handleValidationErrors
];

const validateUpdateMyProfile = [
    body('nickname')
        .optional()
        .trim()
        .isString().withMessage('Nickname must be a string.')
        .isLength({ min: 2, max: 30 }).withMessage('Nickname must be between 2 and 30 characters.')
        // Basic regex to prevent only special characters or overly simple nicknames - adjust as needed
        .matches(/^(?=.*[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣])[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s_.-]{2,30}$/)
        .withMessage('Nickname can contain letters, numbers, Korean characters, spaces, and _.- but must include at least one letter, number or Korean character.'),
    // Note: File upload validation (type, size) is typically handled by Multer middleware.
    // Here, we are validating other text fields that might accompany the file.
    handleValidationErrors
];

module.exports = {
    validateGetMyPageData,
    validateUpdateMyProfile,
}; 