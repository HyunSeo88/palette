const User = require('../models/User');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const mongoose = require('mongoose');

// Helper to create error objects for next()
const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// @desc    Get data for My Page (activity summary, profile, user's posts)
// @route   GET /api/users/me/mypage
// @access  Private
async function getMyPageData(req, res, next) {
    try {
        const userId = req.user.id;

        // 1. Fetch User Profile (already available in req.user, but fetch again for consistency or more fields)
        const userProfile = await User.findById(userId).select('-password').lean(); // lean for performance, exclude password
        if (!userProfile) {
            // return res.status(404).json({ message: 'User not found.' });
            return next(createError(404, 'User not found.'));
        }

        // 2. Activity Summary
        const totalPosts = await Post.countDocuments({ user: userId });
        const totalComments = await Comment.countDocuments({ user: userId, isDeleted: false });

        const postsByTypeAgg = await Post.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$postType', count: { $sum: 1 } } }
        ]);

        const postsByType = postsByTypeAgg.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});       

        const activitySummary = {
            totalPosts,
            totalComments,
            postsByType,
        };

        // 3. User's Posts (Paginated)
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt_desc',
            postType // Allow filtering user's own posts by type
        } = req.query;

        const postsQuery = { user: userId };
        // Unlike public getPosts, we show all statuses to the user for their own posts
        // if (req.query.status) postsQuery.status = req.query.status; // Or allow status filter
        if (postType) postsQuery.postType = postType;

        const sortOptions = {};
        if (sortBy) {
            const parts = sortBy.split('_');
            sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const userPostsDocs = await Post.find(postsQuery)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'nickname profileImage email') // Should be redundant if it's always the current user
            .lean();

        const totalUserPostsCount = await Post.countDocuments(postsQuery);

        const userPosts = {
            posts: userPostsDocs,
            totalPages: Math.ceil(totalUserPostsCount / limit),
            currentPage: parseInt(page),
            totalPosts: totalUserPostsCount,
        };

        res.status(200).json({
            userProfile,
            activitySummary,
            userPosts
        });

    } catch (error) {
        console.error('Error in getMyPageData:', error); // Keep logging for debug
        next(error); // Pass to global error handler
    }
}

// @desc    Update user's profile (nickname, profileImage)
// @route   PUT /api/users/me/profile
// @access  Private
async function updateMyProfile(req, res, next) {
    try {
        const userId = req.user.id;
        const { nickname } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            // return res.status(404).json({ message: 'User not found.' });
            return next(createError(404, 'User not found.'));
        }

        if (nickname) {
            // Add validation for nickname if needed (length, uniqueness if different from current)
            user.nickname = nickname;
        }

        if (req.file) {
            // req.file.path will be like 'server\public\uploads\avatars\avatar-userid-timestamp.ext'
            // Convert to web-accessible URL: '/uploads/avatars/avatar-userid-timestamp.ext'
            user.profileImage = req.file.path.replace(/^server[\\\/]public[\\\/]/, '/').replace(/\\/g, '/');
        }

        const updatedUser = await user.save();

        // Return updated user info (excluding password)
        const userResponse = {
            _id: updatedUser._id,
            nickname: updatedUser.nickname,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            role: updatedUser.role,
            // Add any other fields you want to return
        };

        res.status(200).json(userResponse);

    } catch (error) {
        console.error('Error in updateMyProfile:', error); // Keep logging for debug
        // Mongoose ValidationError will be caught here
        if (error.name === 'ValidationError') {
            // Pass it to the global error handler, which can decide the status code and format
            // Or, create a more specific error object
            const validationError = createError(400, 'Validation failed.');
            validationError.errors = error.errors; // Attach original mongoose errors
            return next(validationError);
        }
        next(error); // Pass other errors to global error handler
    }
}

module.exports = {
    getMyPageData,
    updateMyProfile,
}; 