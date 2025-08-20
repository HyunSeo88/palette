const express = require('express');
const router = express.Router();
// const { auth } = require('../middleware/auth'); // Using authMiddleware instead
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User');

// Import new controller and middleware
const userController = require('../controllers/user.controller');
const avatarUpload = require('../middleware/avatarUpload.middleware');
// Import the new validators
const { validateGetMyPageData, validateUpdateMyProfile } = require('../middleware/validators/user.validator');

// Existing social link/unlink - assuming these are in userController.js from elsewhere or should be merged
// For now, let's assume they might be from a different userController or an older setup.
// If `../controllers/userController` was a typo and meant `user.controller.js`, those functions would need to be there.
// Let's comment out for now if they are not in the new `user.controller.js`
// const { linkSocialAccount, unlinkSocialAccount } = require('../controllers/userController'); 

// --- New My Page Routes ---

// @route   GET /api/users/me/mypage
// @desc    Get all data for the user's My Page
// @access  Private
router.get('/me/mypage', 
    authMiddleware, 
    validateGetMyPageData, // Apply validation
    userController.getMyPageData
);

// @route   PUT /api/users/me/profile
// @desc    Update user's nickname and profile picture
// @access  Private
router.put('/me/profile', 
    authMiddleware, 
    avatarUpload.single('profileImage'), // Middleware for handling single 'profileImage' upload
    validateUpdateMyProfile, // Apply validation
    userController.updateMyProfile
);

// --- Existing Routes (Review and Standardize) ---

// Get user profile (Simplified version)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user should be populated by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.'});
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in get user profile:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// Update user profile (Existing general update - different from /me/profile)
// This allows updating bio, colorVisionType. Uses /:id which could be for admins or self.
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nickname, bio, colorVisionType } = req.body;
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // Check if user is updating their own profile or is an admin
    if (userToUpdate._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }

    // Update fields if provided
    if (nickname) userToUpdate.nickname = nickname;
    if (bio !== undefined) userToUpdate.bio = bio;
    if (colorVisionType) userToUpdate.colorVisionType = colorVisionType;

    await userToUpdate.save();
    const responseUser = userToUpdate.toObject();
    delete responseUser.password;

    res.json({ success: true, data: responseUser });
  } catch (error) {
    console.error('Error in update user profile:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// Delete user account
// Ensure this is self-delete or admin delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // Check if user is deleting their own account or is an admin
    if (userToDelete._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }
    
    // Perform soft delete or actual removal based on policy
    // For now, it's a hard delete with .remove()
    // Consider changing to soft delete: userToDelete.status = 'deleted'; await userToDelete.save();
    await userToDelete.remove(); 

    res.json({ success: true, message: '계정이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error in delete user:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// TODO: Review social account linking. The require was to '../controllers/userController' (singular)
// If linkSocialAccount and unlinkSocialAccount are needed from the new `user.controller.js`,
// they should be added there and exported.
// router.post('/me/link-social', authMiddleware, linkSocialAccount);
// router.post('/me/unlink-social', authMiddleware, unlinkSocialAccount);

module.exports = router; 