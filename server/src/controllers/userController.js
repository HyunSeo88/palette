const User = require('../models/User');
const { verifyGoogleToken, verifyKakaoToken, getGoogleUserInfoFromAccessToken } = require('../utils/socialAuth');

// @desc    Link a social account to the current user
// @route   POST /api/users/me/link-social
// @access  Private
exports.linkSocialAccount = async (req, res, next) => {
  try {
    const { provider, token } = req.body; 
    const userId = req.user.id;

    if (!provider || !token) {
      return res.status(400).json({ success: false, message: 'Provider and token (idToken or accessToken) are required.' });
    }

    let socialProfileData;
    try {
      if (provider === 'google') {
        const googleUserInfo = await getGoogleUserInfoFromAccessToken(token);
        if (!googleUserInfo || !googleUserInfo.id) {
          return res.status(401).json({ success: false, message: 'Failed to get user info from Google token.', errorCode: 'GOOGLE_USER_INFO_FAILED' });
        }
        socialProfileData = {
          socialId: googleUserInfo.id,
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          profileImage: googleUserInfo.profileImage,
          isEmailVerified: googleUserInfo.isEmailVerified,
        };
      } else if (provider === 'kakao') {
        socialProfileData = await verifyKakaoToken(token);
      } else {
        return res.status(400).json({ success: false, message: 'Unsupported provider.', errorCode: 'UNSUPPORTED_PROVIDER' });
      }
    } catch (error) {
      if (error.name === 'SocialTokenVerificationError') {
        return res.status(error.statusCode || 401).json({ success: false, message: error.message, errorCode: 'SOCIAL_TOKEN_INVALID' });
      }
      if (error.name === 'GoogleUserInfoError') {
        return res.status(error.statusCode || 401).json({ success: false, message: error.message, errorCode: 'GOOGLE_USER_INFO_FAILED' });
      }
      return res.status(401).json({ success: false, message: `Failed to verify token or get user info with ${provider}: ${error.message}`, errorCode: 'SOCIAL_VERIFICATION_OR_INFO_FAILED' });
    }

    const { socialId, email: socialEmail, name: socialName, profileImage: socialProfileImage, isEmailVerified: socialEmailVerified } = socialProfileData;

    if (!socialId) {
        return res.status(400).json({ success: false, message: 'Could not retrieve socialId from token.', errorCode: 'SOCIAL_ID_MISSING' });
    }

    const existingUserWithSocialId = await User.findOne({ provider, socialId, _id: { $ne: userId } });
    if (existingUserWithSocialId) {
      return res.status(409).json({ 
        success: false, 
        message: 'This social account is already linked to another Palette account.',
        errorCode: 'SOCIAL_ACCOUNT_ALREADY_LINKED' 
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.', errorCode: 'USER_NOT_FOUND' });
    }

    currentUser.provider = provider;
    currentUser.socialId = socialId;
    
    // 소셜 프로필 정보로 사용자 정보 선택적 업데이트
    // if (socialName && (!currentUser.nickname || currentUser.nickname === `User_${userId.substring(0,8)}`)) {
    //     currentUser.nickname = socialName;
    // }
    // if (socialProfileImage && currentUser.profileImage === 'default-profile.png') {
    //     currentUser.profileImage = socialProfileImage;
    // }

    // 이메일 처리 로직:
    // 1. 소셜 계정에 이메일이 있고, 현재 사용자의 이메일과 다른 경우:
    //    그 소셜 이메일이 다른 Palette 계정에 이미 사용 중인지 확인.
    //    (선택) 현재 사용자의 이메일을 소셜 이메일로 업데이트할지, 아니면 현재 이메일을 유지할지 정책 결정.
    // 2. 소셜 계정에 이메일이 있고, 현재 사용자의 이메일과 같거나, 현재 사용자가 이메일이 없는 경우 (이론상으론 없어야함)
    //    소셜 이메일의 인증 상태를 Palette 계정에 반영 가능.

    if (socialEmail) {
      if (socialEmail !== currentUser.email) {
        const existingUserWithSocialEmail = await User.findOne({ email: socialEmail, _id: { $ne: userId } });
        if (existingUserWithSocialEmail) {
          return res.status(409).json({
            success: false,
            message: `The email ${socialEmail} from your ${provider} account is already associated with another Palette account. Please use a different social account or log in with that email.`,
            errorCode: 'EMAIL_ALREADY_EXISTS_FOR_SOCIAL'
          });
        }
        // 선택: currentUser.email = socialEmail; currentUser.isEmailVerified = socialEmailVerified || false;
        // 또는 사용자에게 이메일 변경 여부를 묻는 로직 (프론트엔드에서 처리 후 다른 API 호출)
        // 현재는 Palette 계정의 기존 이메일을 유지한다고 가정.
      } else {
        // 소셜 이메일과 현재 이메일이 같은 경우, 인증 상태 업데이트 가능
        if (socialEmailVerified === true && !currentUser.isEmailVerified) {
          currentUser.isEmailVerified = true;
        }
      }
    }
    // Kakao의 경우 email이 선택 동의 항목이라 없을 수 있음. 이 경우 currentUser.email은 변경하지 않음.

    await currentUser.save();

    res.status(200).json({ 
      success: true, 
      message: `${provider} account linked successfully.`,
      data: {
        provider: currentUser.provider,
        socialId: currentUser.socialId,
        email: currentUser.email,
        nickname: currentUser.nickname,
        profileImage: currentUser.profileImage,
        isEmailVerified: currentUser.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Error in linkSocialAccount:', error);
    next(error);
  }
};

// @desc    Unlink a social account from the current user
// @route   POST /api/users/me/unlink-social
// @access  Private
exports.unlinkSocialAccount = async (req, res, next) => {
  try {
    const { providerToUnlink } = req.body; 
    const userId = req.user.id;

    if (!providerToUnlink) {
      return res.status(400).json({ success: false, message: 'Provider to unlink is required.' });
    }

    const currentUser = await User.findById(userId).select('+password');
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.', errorCode: 'USER_NOT_FOUND' });
    }

    if (currentUser.provider !== providerToUnlink) {
      return res.status(400).json({ 
        success: false, 
        message: `This account is not currently linked with ${providerToUnlink}. It is linked with ${currentUser.provider}.`,
        errorCode: 'PROVIDER_MISMATCH_UNLINK'
      });
    }

    if (!currentUser.password && currentUser.provider !== 'email') {
        // 이메일 가입이 아니었고, 비밀번호도 없는데, 유일한 소셜 로그인을 해제하려는 경우
        console.warn(`User ${userId} is unlinking their only social login (${providerToUnlink}) and has no password set. They might lose access.`);
        // 정책: 비밀번호 설정 유도 또는 해제 후 이메일 인증 재요청 등...
        // 현재는 그대로 진행하고 provider를 'email'로 변경
    }

    currentUser.socialId = undefined;
    currentUser.provider = 'email'; 
    // 참고: 만약 사용자가 여러 소셜 계정을 가질 수 있다면, 해당 provider의 정보만 제거해야 함.

    await currentUser.save();

    // 성공 응답에 업데이트된 사용자 정보 일부 포함
    res.status(200).json({ 
      success: true, 
      message: `${providerToUnlink} account unlinked successfully. Account provider set to 'email'.`,
      data: {
        provider: currentUser.provider,
        email: currentUser.email, // provider가 email로 변경되었으므로 이메일은 유지
      }
    });

  } catch (error) {
    console.error('Error in unlinkSocialAccount:', error);
    next(error);
  }
}; 