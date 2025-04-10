const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in get user profile:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    const { nickname, bio, colorVisionType } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // Check if user is updating their own profile
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }

    // Update fields if provided
    if (nickname) user.nickname = nickname;
    if (bio !== undefined) user.bio = bio;
    if (colorVisionType) user.colorVisionType = colorVisionType;

    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in update user profile:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// Delete user account
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // Check if user is deleting their own account
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }

    await user.remove();

    res.json({ success: true, message: '계정이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error in delete user:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 