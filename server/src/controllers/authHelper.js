const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User'); // User 모델도 필요할 수 있음 (닉네임 생성 등)
const { sendTokenResponse } = require('../middleware/auth');

// googleOAuthClient는 이제 직접 사용되지 않지만, 다른 로직에서 잠재적으로 사용될 수 있으므로 남겨두거나, 완전히 제거해도 됩니다.
// const googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function getSocialUserInfo(provider, token) {
  if (provider === 'google') {
    try {
      console.log('[getSocialUserInfo] Google: Received token (presumed Access Token), attempting to fetch userinfo.');
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = response.data;
      console.log('[getSocialUserInfo] Google: Userinfo endpoint response payload:', payload);

      if (!payload || !payload.sub) {
        console.error('[getSocialUserInfo] Google: Failed to get user info from userinfo endpoint or \'sub\' (socialId) is missing.');
        throw new Error('Google 사용자 정보 조회에 실패했거나 필수 정보(ID)가 없습니다.');
    }
    return {
      socialId: payload.sub,
      email: payload.email,
        nickname: payload.name || payload.given_name,
      profileImage: payload.picture,
      isSocialEmailVerified: payload.email_verified,
        provider: 'google'
      };
    } catch (error) {
      console.error('[getSocialUserInfo] Google: Error fetching user info with Access Token.');
      if (error.response) {
        console.error('[getSocialUserInfo] Google: API Error Status:', error.response.status);
        console.error('[getSocialUserInfo] Google: API Error Data:', error.response.data);
        const apiError = error.response.data.error;
        const apiErrorDescription = error.response.data.error_description;
        let message = `Google API 오류: ${apiError || '알 수 없는 오류'}`;
        if (apiErrorDescription) message += ` (${apiErrorDescription})`;
        // Google API의 401은 일반적으로 토큰 문제임
        if (error.response.status === 401 || error.response.status === 400) { // 400도 토큰 포맷 문제일 수 있음
            message = 'Google 토큰이 유효하지 않거나 만료되었습니다. 다시 로그인해주세요.';
        }
        throw new Error(message);
      } else if (error.request) {
        console.error('[getSocialUserInfo] Google: No response received from Google API:', error.request);
        throw new Error('Google API에서 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
      } else {
        console.error('[getSocialUserInfo] Google: Error in setting up request to Google API:', error.message);
        throw new Error('Google API 요청 설정 중 오류가 발생했습니다: ' + error.message);
      }
    }
  } else if (provider === 'kakao') {
    // Kakao 로직은 변경 없음 (기존 코드 유지)
    try {
      console.log('[getSocialUserInfo] Kakao: Received token (Access Token), attempting to fetch userinfo.');
    const kakaoUserResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });
    const kakaoUserData = kakaoUserResponse.data;
      console.log('[getSocialUserInfo] Kakao: Userinfo response payload:', kakaoUserData);
    if (!kakaoUserData || !kakaoUserData.id) {
        console.error('[getSocialUserInfo] Kakao: Failed to get user info from Kakao API or ID is missing.');
      throw new Error('Kakao 사용자 정보를 가져오는데 실패했습니다.');
    }
    return {
      socialId: String(kakaoUserData.id),
      email: kakaoUserData.kakao_account?.email,
      nickname: kakaoUserData.properties?.nickname,
      profileImage: kakaoUserData.properties?.profile_image,
      isSocialEmailVerified: kakaoUserData.kakao_account?.is_email_verified,
        provider: 'kakao'
      };
    } catch (error) {
        console.error('[getSocialUserInfo] Kakao: Error fetching user info with Access Token.');
        if (error.response) {
            console.error('[getSocialUserInfo] Kakao: API Error Status:', error.response.status);
            console.error('[getSocialUserInfo] Kakao: API Error Data:', error.response.data);
            const message = error.response.data?.msg || 'Kakao API 처리 중 오류 발생';
            throw new Error(message);
        } else if (error.request) {
            console.error('[getSocialUserInfo] Kakao: No response received from Kakao API:', error.request);
            throw new Error('Kakao API에서 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
        } else {
            console.error('[getSocialUserInfo] Kakao: Error in setting up request to Kakao API:', error.message);
            throw new Error('Kakao API 요청 설정 중 오류가 발생했습니다: ' + error.message);
        }
    }
  }
  console.error(`[getSocialUserInfo] Unsupported provider: ${provider}`);
  throw new Error('지원하지 않는 소셜 프로바이더입니다.');
}

async function generateUniqueNickname(baseNickname) {
  let nickname = baseNickname;
  let counter = 1;
  // MongoDB는 대소문자를 구분하는 닉네임 검색을 지원하지만, 사용자 경험상 유사 닉네임을 피하기 위해 정규식 사용
  while (await User.findOne({ nickname: { $regex: new RegExp(`^${nickname}$`, 'i') } })) {
    nickname = `${baseNickname}${counter}`;
    counter++;
  }
  return nickname;
}

async function processSocialLogin(socialProfile, intent, req, res, next) {
  const { provider: providerName, socialId, email: socialEmail, nickname: nameFromSocial, profileImage, isSocialEmailVerified } = socialProfile;
  let user = null;
  let isNewUserResponse = false; // This flag indicates if the response is for a newly created user

  console.log(`[ProcessSocialLogin - ${providerName}] Intent: ${intent}, SocialID: ${socialId}, Email from social: ${socialEmail}, Req user: ${req.user ? req.user.id : 'None'}`);

  try {
    if (intent === 'link') {
      console.log(`[ProcessSocialLogin - ${providerName} - Link] Attempting to link account.`);
      if (!req.user || !req.user.id) {
        console.error(`[ProcessSocialLogin - ${providerName} - Link] User not authenticated.`);
        return res.status(401).json({ success: false, message: '계정 연동을 위해서는 먼저 로그인이 필요합니다.', errorCode: 'NOT_AUTHENTICATED_FOR_LINK' });
      }
      
      const loggedInUser = await User.findById(req.user.id);
      if (!loggedInUser) {
        console.error(`[ProcessSocialLogin - ${providerName} - Link] Logged-in user (ID: ${req.user.id}) not found in DB.`);
        return res.status(404).json({ success: false, message: '로그인된 사용자 정보를 찾을 수 없습니다.', errorCode: 'LOGGED_IN_USER_NOT_FOUND' });
      }
      console.log(`[ProcessSocialLogin - ${providerName} - Link] Found logged-in user: ${loggedInUser.email}`);

      // Check if this social account is already linked to *another* user
      const conflictingUser = await User.findOne({ 
        'socialLinks.provider': providerName, 
        'socialLinks.socialId': socialId,
        _id: { $ne: loggedInUser._id } 
      });

      if (conflictingUser) {
        console.warn(`[ProcessSocialLogin - ${providerName} - Link] Social account ${socialId} is already linked to a different user: ${conflictingUser.email}`);
        const emailParts = conflictingUser.email.split('@');
        const maskedEmail = emailParts[0].length > 3 ? `${emailParts[0].substring(0, 3)}***@${emailParts[1]}` : `***@${emailParts[1]}`;
        return res.status(409).json({ 
                success: false, 
          message: `이 ${providerName} 계정은 이미 다른 Palette 사용자(${maskedEmail})에게 연결되어 있습니다.`,
          errorCode: 'SOCIAL_ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER'
        });
      }

      // Check if this social account is already linked to the *current* user
      const existingLink = loggedInUser.socialLinks.find(link => link.provider === providerName && link.socialId === socialId);
      if (existingLink) {
        console.log(`[ProcessSocialLogin - ${providerName} - Link] This ${providerName} account is already linked to the current user.`);
        // Optionally update details like profile image or nickname from social if changed
        let detailsUpdated = false;
        if (profileImage && existingLink.profileImage !== profileImage) {
          existingLink.profileImage = profileImage;
          detailsUpdated = true;
        }
        if (nameFromSocial && existingLink.nickname !== nameFromSocial) {
          existingLink.nickname = nameFromSocial;
          detailsUpdated = true;
        }
        if (socialEmail && existingLink.email !== socialEmail) {
          existingLink.email = socialEmail;
          detailsUpdated = true;
        }
        if (detailsUpdated) {
          await loggedInUser.save();
          console.log(`[ProcessSocialLogin - ${providerName} - Link] User social link details updated.`);
        }
        // Send response indicating already linked, perhaps with updated user info
        return sendTokenResponse(loggedInUser, 200, res, { message: `${providerName} 계정이 이미 연결되어 있습니다.`, isNewUser: false, linkedAccount: true });
      }

      // Add new social link
      loggedInUser.socialLinks.push({
        provider: providerName,
        socialId,
        email: socialEmail,
        nickname: nameFromSocial,
        profileImage,
        isVerified: isSocialEmailVerified === undefined ? true : isSocialEmailVerified, // Assume verified if undefined
        linkedAt: Date.now(),
      });

      // If the user's primary email was not verified and this social email matches and is verified, mark primary as verified.
      if (loggedInUser.email === socialEmail && (isSocialEmailVerified === undefined ? true : isSocialEmailVerified) && !loggedInUser.isEmailVerified) {
        loggedInUser.isEmailVerified = true;
        console.log(`[ProcessSocialLogin - ${providerName} - Link] User primary email ${loggedInUser.email} now verified via ${providerName} link.`);
      }
      
      await loggedInUser.save();
      user = loggedInUser;
      isNewUserResponse = false; // Not a new user, just linking
      console.log(`[ProcessSocialLogin - ${providerName} - Link] Account linked successfully for user: ${user.email}`);
      return sendTokenResponse(user, 200, res, { message: `${providerName} 계정이 성공적으로 연결되었습니다.`, isNewUser: false, linkedAccount: true });

    } else { // Intent is 'login' or 'signup'
      console.log(`[ProcessSocialLogin - ${providerName} - ${intent}] Attempting ${intent}.`);
      
      // 1. Try to find user by Social ID via socialLinks
      user = await User.findOne({ 'socialLinks.provider': providerName, 'socialLinks.socialId': socialId }).select('+password'); // Select password for potential local login path
      
      if (user) { // User found via socialLinks
        console.log(`[ProcessSocialLogin - ${providerName} - ${intent}] User found by social link: ${user.email}. Proceeding with login.`);
        // Optionally update socialLink details if changed (name, picture)
        const link = user.socialLinks.find(sl => sl.provider === providerName && sl.socialId === socialId);
        if (link) {
            let linkUpdated = false;
            if (nameFromSocial && link.nickname !== nameFromSocial) { link.nickname = nameFromSocial; linkUpdated = true; }
            if (profileImage && link.profileImage !== profileImage) { link.profileImage = profileImage; linkUpdated = true; }
            if (socialEmail && link.email !== socialEmail) { link.email = socialEmail; linkUpdated = true; }
            if (linkUpdated) await user.save();
        }
            isNewUserResponse = false;
        return sendTokenResponse(user, 200, res, { message: '소셜 계정으로 로그인되었습니다.', isNewUser: false });
      }

      // User not found by social link. Now consider email.
      console.log(`[ProcessSocialLogin - ${providerName} - ${intent}] User not found by social link. Checking email: ${socialEmail}`);

      if (!socialEmail) {
        // This case is tricky. If a provider (like Kakao sometimes) doesn't return email,
        // and it's a first-time signup, we can't create an account without an email.
        // If it's login, and no user was found by socialId, then it's an error.
        if (intent === 'signup') {
          console.error(`[ProcessSocialLogin - ${providerName} - Signup] Cannot signup without an email from social provider.`);
            return res.status(400).json({
              success: false,
            message: `${providerName} 계정에서 이메일 정보를 가져올 수 없습니다. ${providerName} 계정 설정을 확인하거나 다른 방법으로 가입해주세요.`,
            errorCode: 'SOCIAL_SIGNUP_NO_EMAIL' 
          });
        } else { // intent === 'login'
          console.log(`[ProcessSocialLogin - ${providerName} - Login] Login failed. No user with this ${providerName} account and no email provided to check further.`);
          return res.status(404).json({
            success: false,
            message: `해당 ${providerName} 계정을 찾을 수 없습니다. 이메일 정보도 없어 기존 계정 확인이 어렵습니다. 회원가입을 시도하시거나 다른 로그인 방법을 이용해주세요.`,
            errorCode: 'SOCIAL_LOGIN_NO_ACCOUNT_NO_EMAIL_FALLBACK'
          });
        }
      }
      
      const userByEmail = await User.findOne({ email: socialEmail }).select('+password');

      if (userByEmail) { // User found by email
        console.log(`[ProcessSocialLogin - ${providerName} - ${intent}] User found by email: ${userByEmail.email}.`);
        if (intent === 'signup') {
          // Email exists, but tried to signup with a new social account.
          // This implies the social account isn't linked yet.
          console.warn(`[ProcessSocialLogin - ${providerName} - Signup] Signup attempt with existing email ${socialEmail}.`);
          let message = `이미 ${socialEmail} 주소로 가입된 계정이 있습니다. `;
          if (userByEmail.provider === 'email') {
            message += `이메일과 비밀번호로 로그인 후, 설정 페이지에서 ${providerName} 계정을 연결해주세요.`;
      } else {
            message += `기존 ${userByEmail.provider} 계정으로 로그인 후, 설정 페이지에서 이 ${providerName} 계정을 추가로 연결하거나, 다른 이메일로 가입해주세요.`;
          }
          return res.status(409).json({ 
            success: false, 
            message,
            errorCode: 'EMAIL_ALREADY_EXISTS_SOCIAL_SIGNUP' 
          });
        } else { // intent === 'login'
          // User exists with this email, but the specific socialId was not found in socialLinks.
          // This means they are trying to log in with a social account not yet linked to their email-based account.
          console.log(`[ProcessSocialLogin - ${providerName} - Login] Email ${socialEmail} exists, but not linked to this ${providerName} account.`);
          return res.status(403).json({ 
            success: false, 
            message: `${socialEmail}로 가입된 계정이 있으나, 현재 ${providerName} 계정과는 연결되어 있지 않습니다. 기존 방식으로 로그인 후 ${providerName} 계정을 연결하거나, 이 ${providerName} 계정으로 새로 가입해주세요.`,
            errorCode: 'EMAIL_EXISTS_SOCIAL_NOT_LINKED_FOR_LOGIN'
          });
        }
      } else { // No user by social link, no user by email.
        if (intent === 'login') {
          console.log(`[ProcessSocialLogin - ${providerName} - Login] No account found for ${socialEmail} or social ID ${socialId}.`);
          return res.status(404).json({ 
            success: false, 
            message: `해당 ${providerName} 계정 또는 이메일로 가입된 사용자를 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.`, 
            errorCode: 'ACCOUNT_NOT_FOUND_SOCIAL_LOGIN' 
          });
        } else { // intent === 'signup'
          console.log(`[ProcessSocialLogin - ${providerName} - Signup] Creating new user with email ${socialEmail} and ${providerName} ID ${socialId}.`);
          
          let newNickname = nameFromSocial || socialEmail.split('@')[0];
          newNickname = await generateUniqueNickname(newNickname);
          if (newNickname.length < 2) newNickname = await generateUniqueNickname("User"); // Ensure minimum length for nickname
          if (newNickname.length > 30) newNickname = newNickname.substring(0, 30);


          const newUser = new User({
            email: socialEmail,
            nickname: newNickname,
            provider: providerName, // Main provider is this social provider
            isEmailVerified: isSocialEmailVerified === undefined ? true : isSocialEmailVerified, // Assume verified if undefined
            profileImage: profileImage || 'default-profile.png',
            socialLinks: [{
              provider: providerName,
              socialId,
              email: socialEmail,
              nickname: nameFromSocial, // Store original social nickname in link
              profileImage: profileImage,
              isVerified: isSocialEmailVerified === undefined ? true : isSocialEmailVerified,
              linkedAt: Date.now(),
            }]
          });
          
          await newUser.save();
          user = newUser;
          isNewUserResponse = true;
          console.log(`[ProcessSocialLogin - ${providerName} - Signup] New user created: ${user.email}`);
          return sendTokenResponse(user, 201, res, { message: `${providerName} 계정으로 성공적으로 가입되었습니다.`, isNewUser: true });
        }
      }
    }
  } catch (error) {
    console.error(`[ProcessSocialLogin - ${providerName}] Error during social login/signup/link process:`, error);
    // Ensure 'next' is called for unexpected errors to be handled by global error handler
    // Check if error is a Mongoose validation error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', '), errorCode: 'VALIDATION_ERROR' });
    }
    return next(error); // Pass to global error handler
  }
  // Fallback, should ideally be handled by specific paths above
  // If user is resolved and no response sent yet (should not happen with current logic)
  if (user) {
    return sendTokenResponse(user, isNewUserResponse ? 201 : 200, res, { message: isNewUserResponse ? '가입 성공' : '로그인 성공', isNewUser: isNewUserResponse });
  }
  // If no user and no response sent (should not happen)
  console.error(`[ProcessSocialLogin - ${providerName}] Reached end of function without explicit response. This is a bug.`);
  return res.status(500).json({ success: false, message: '알 수 없는 서버 오류가 발생했습니다.', errorCode: 'UNHANDLED_SOCIAL_PROCESS_FLOW' });
}

async function completeKakaoSignup(profileData, res, next) {
  const { kakaoId, nickname, profileImage, email } = profileData;

  console.log(`[CompleteKakaoSignup] Received data: kakaoId=${kakaoId}, nickname=${nickname}, email=${email}`);

  if (!email) {
    console.error('[CompleteKakaoSignup] Email is required for Kakao signup completion.');
    return res.status(400).json({ success: false, message: '카카오 계정에서 이메일 정보를 동의해주세요. 이메일은 필수입니다.', errorCode: 'KAKAO_SIGNUP_EMAIL_REQUIRED' });
  }

  // This function is specifically for completing a signup where Kakao didn't initially provide an email.
  // We now have the email, so we proceed as if it's a new social signup.
  
  try {
    // Check if user already exists with this Kakao ID (in socialLinks)
    let user = await User.findOne({ 'socialLinks.provider': 'kakao', 'socialLinks.socialId': String(kakaoId) });
    if (user) {
      console.log(`[CompleteKakaoSignup] User already exists with Kakao ID ${kakaoId}: ${user.email}. Treating as login.`);
      return sendTokenResponse(user, 200, res, { message: '이미 가입된 카카오 계정입니다. 로그인합니다.', isNewUser: false });
    }

    // Check if user already exists with this email
    user = await User.findOne({ email: email });
    if (user) {
      console.warn(`[CompleteKakaoSignup] Email ${email} already exists. User provider: ${user.provider}.`);
      // If email exists, and it's an email account, or a different social account, advise to link.
      let message = `이미 ${email} 주소로 가입된 계정이 있습니다. `;
      if (user.provider === 'email') {
        message += `이메일과 비밀번호로 로그인 후, 설정 페이지에서 카카오 계정을 연결해주세요.`;
      } else {
        message += `기존 ${user.provider} 계정으로 로그인 후, 카카오 계정을 추가로 연결해주세요.`;
      }
      return res.status(409).json({ 
          success: false, 
        message,
        errorCode: 'EMAIL_ALREADY_EXISTS_KAKAO_SIGNUP_COMPLETION'
      });
    }

    // Create new user if no existing user by Kakao ID or email
    console.log(`[CompleteKakaoSignup] Creating new user with Kakao ID ${kakaoId} and email ${email}.`);
    let newNickname = nickname || email.split('@')[0];
    newNickname = await generateUniqueNickname(newNickname);
    if (newNickname.length < 2) newNickname = await generateUniqueNickname("User");
    if (newNickname.length > 30) newNickname = newNickname.substring(0,30);


    const newUser = new User({
      email: email,
      nickname: newNickname,
      provider: 'kakao', // Main provider is Kakao for this signup flow
      isEmailVerified: true, // Kakao email is usually verified if provided
      profileImage: profileImage || 'default-profile.png',
      socialLinks: [{
        provider: 'kakao',
        socialId: String(kakaoId),
        email: email,
        nickname: nickname,
        profileImage: profileImage,
        isVerified: true, // Assume verified from Kakao
        linkedAt: Date.now(),
      }]
    });

    await newUser.save();
    console.log(`[CompleteKakaoSignup] New user created successfully: ${newUser.email}`);
    return sendTokenResponse(newUser, 201, res, { message: '카카오 계정으로 성공적으로 가입되었습니다.', isNewUser: true });

  } catch (error) {
    console.error('[CompleteKakaoSignup] Error:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', '), errorCode: 'VALIDATION_ERROR_KAKAO_SIGNUP' });
    }
    return next(error);
  }
}

module.exports = { getSocialUserInfo, processSocialLogin, completeKakaoSignup }; 