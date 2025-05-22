const { body, validationResult } = require('express-validator');
const Post = require('../../models/Post.model'); // For checking postType enum values

const validateCreatePost = [
    body('postType')
        .trim()
        .notEmpty().withMessage('Post type is required.')
        .isIn(Post.schema.path('postType').enumValues)
        .withMessage('Invalid post type.'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters.'),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required.')
        .custom((value, { req }) => {
            if (req.body.postType === 'ootd') {
                if (value.length > 500) {
                    throw new Error('Content for OOTD post cannot be more than 500 characters.');
                }
            }
            return true;
        }),

    body('images')
        .optional()
        .isArray().withMessage('Images must be an array of strings.')
        .custom((value, { req }) => {
            if (req.body.postType === 'ootd') {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('At least one image is required for OOTD posts.');
                }
                value.forEach(item => {
                    if (typeof item !== 'string' || !item.trim()) {
                        throw new Error('Each image must be a non-empty string URL.');
                    }
                    // Basic URL validation (can be enhanced)
                    try {
                        new URL(item);
                    } catch (error) {
                        throw new Error('Invalid image URL format.');
                    }
                });
            } else {
                if (value) { // If images are provided for non-ootd posts, validate them
                    value.forEach(item => {
                        if (typeof item !== 'string' || !item.trim()) {
                            throw new Error('Each image must be a non-empty string URL.');
                        }
                         try {
                            new URL(item);
                        } catch (error) {
                            throw new Error('Invalid image URL format.');
                        }
                    });
                }
            }
            return true;
        }),

    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array of strings.')
        .custom((value) => {
            if (value) {
                value.forEach(tag => {
                    if (typeof tag !== 'string' || !tag.trim()) {
                        throw new Error('Each tag must be a non-empty string.');
                    }
                });
            }
            return true;
        }),
    
    body('status')
        .optional()
        .trim()
        .isIn(Post.schema.path('status').enumValues)
        .withMessage('Invalid status value.'),

    body('additionalFields')
        .optional()
        .isObject().withMessage('Additional fields must be an object.'),

    body('additionalFields.style')
        .if(body('postType').equals('ootd'))
        .optional({ checkFalsy: true }) // Allow empty string, but if provided, must be string
        .isString().withMessage('Style must be a string.')
        .trim(),
        // .notEmpty().withMessage('Style cannot be empty if provided for OOTD.'), // Let's allow empty string for style

    body('additionalFields.season')
        .if(body('postType').equals('ootd'))
        .optional({ checkFalsy: true }) // Allow empty string
        .isString().withMessage('Season must be a string.')
        .trim(),
        // .notEmpty().withMessage('Season cannot be empty if provided for OOTD.'), // Let's allow empty string for season

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateCreatePost,
}; 