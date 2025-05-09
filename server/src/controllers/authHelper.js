const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User'); // User 모델도 필요할 수 있음 (닉네임 생성 등)
const { sendTokenResponse } = require('../middleware/auth');

const googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function getSocialUserInfo(provider, token) {
  if (provider === 'google') {
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Google 토큰 검증에 실패했습니다.');
    }
    return {
      socialId: payload.sub,
      email: payload.email,
      nickname: payload.name,
      profileImage: payload.picture,
      isSocialEmailVerified: payload.email_verified,
      provider: 'google' // 나중에 processSocialLogin에서 활용
    };
  } else if (provider === 'kakao') {
    const kakaoUserResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });
    const kakaoUserData = kakaoUserResponse.data;
    if (!kakaoUserData || !kakaoUserData.id) {
      throw new Error('Kakao 사용자 정보를 가져오는데 실패했습니다.');
    }
    return {
      socialId: String(kakaoUserData.id),
      email: kakaoUserData.kakao_account?.email,
      nickname: kakaoUserData.properties?.nickname,
      profileImage: kakaoUserData.properties?.profile_image,
      isSocialEmailVerified: kakaoUserData.kakao_account?.is_email_verified,
      provider: 'kakao' // 나중에 processSocialLogin에서 활용
    };
  }
  console.error(`[getSocialUserInfo] Unsupported provider: ${provider}`);
  throw new Error('지원하지 않는 소셜 프로바이더입니다.');
}

async function processSocialLogin(socialProfile, intent, res, next) {
  const { provider, socialId, email, nickname: nameFromSocial, profileImage, isSocialEmailVerified } = socialProfile;
  let user = null;
  let isNewUserResponse = false;

  console.log(`[ProcessSocialLogin - ${provider}] Intent: ${intent}, SocialID: ${socialId}, Email: ${email}`);

  try {
    // 1. Find user by provider and socialId (most direct way)
    user = await User.findOne({ provider, socialId });
    console.log(`[ProcessSocialLogin - ${provider}] User initially found by ${provider}Id (${socialId}):`, user ? user.toObject() : null);

    if (intent === 'login') {
      if (user) {
        // Case L1 (Generic): Social ID exists - Login
        console.log(`[ProcessSocialLogin - ${provider} - Login] User found by ${provider}Id. Logging in.`);
        isNewUserResponse = false;
      } else {
        // Social ID not found, check by email for potential linking or account not found
        console.log(`[ProcessSocialLogin - ${provider} - Login] User not by ${provider}Id. Checking by email.`);
        
        if (!email) {
          // Case L2 (Kakao specific, or if Google somehow had no email):
          // No email from social provider, and social ID not found - Account not found (or special handling for Kakao no-email)
          console.log(`[ProcessSocialLogin - ${provider} - Login] No email from social provider.`);
          if (provider === 'kakao') {
             return res.status(404).json({
                success: false,
                message: '해당 Kakao 계정으로 가입된 사용자를 찾을 수 없으며, 이메일 정보도 없어 기존 계정을 찾을 수 없습니다. 회원가입을 진행해주세요.',
                errorCode: 'ACCOUNT_NOT_FOUND_NO_EMAIL',
                tempKakaoProfile: { // Send back the profile for client to use in SocialEmailRequestPage
                    kakaoId: socialId,
                    nickname: nameFromSocial,
                    profileImage: profileImage
                }
            });
          } else {
            // For Google or other providers if they somehow don't provide email and socialId not found
            return res.status(404).json({ 
                success: false, 
                message: `해당 ${provider} 계정으로 가입된 사용자를 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.`,
                errorCode: 'ACCOUNT_NOT_FOUND' 
            });
          }
        }

        const existingUserWithEmail = await User.findOne({ email: email });
        console.log(`[ProcessSocialLogin - ${provider} - Login] User found by email (${email}):`, existingUserWithEmail ? existingUserWithEmail.toObject() : null);

        if (existingUserWithEmail) {
          if (existingUserWithEmail.provider === 'email') {
            // Case L3: Email exists with 'email' provider - Prompt for manual link
            console.log(`[ProcessSocialLogin - ${provider} - Login] Email matched, provider is 'email'. Prompting for manual link.`);
            return res.status(403).json({
              success: false,
              message: `이미 해당 이메일 주소로 가입된 계정이 있습니다. 기존 계정에 로그인 후 ${provider} 계정을 연결하거나, 다른 ${provider} 계정을 사용해주세요.`,
              errorCode: "EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK"
            });
          } else if (existingUserWithEmail.provider !== provider) {
            // Case L4: Email exists with OTHER social provider - Link to current provider and login
            console.log(`[ProcessSocialLogin - ${provider} - Login] Email matched, provider is ${existingUserWithEmail.provider}. Linking account to ${provider}.`);
            existingUserWithEmail.provider = provider; 
            existingUserWithEmail.socialId = socialId; 
            existingUserWithEmail.profileImage = profileImage || existingUserWithEmail.profileImage;
            existingUserWithEmail.nickname = nameFromSocial || existingUserWithEmail.nickname;
            existingUserWithEmail.isEmailVerified = isSocialEmailVerified === undefined ? existingUserWithEmail.isEmailVerified : isSocialEmailVerified;
            await existingUserWithEmail.save();
            user = existingUserWithEmail;
            isNewUserResponse = false;
          } else {
            // Email exists, provider is SAME, but socialId did not match (implies different social account for same email under same provider)
            // This case should ideally be rare if (email, provider) is meant to be unique or socialId is the primary key for a provider.
            console.warn(`[ProcessSocialLogin - ${provider} - Login] Email matched, provider is ${provider}, but different socialId. Data inconsistency or attempt to link different account.`);
            return res.status(400).json({
              success: false,
              message: `해당 이메일은 이미 다른 ${provider} 계정과 연결되어 있습니다.`,
              errorCode: 'ACCOUNT_LINKED_TO_DIFFERENT_SOCIAL' // Or a more specific error
            });
          }
        } else {
          // Case L5: No account by Social ID and no account by email - Account not found
          console.log(`[ProcessSocialLogin - ${provider} - Login] No user found by email. Account not found.`);
          return res.status(404).json({
            success: false,
            message: `해당 ${provider} 계정으로 가입된 사용자를 찾을 수 없습니다. 먼저 회원가입을 진행해주세요.`,
            errorCode: 'ACCOUNT_NOT_FOUND'
          });
        }
      }
    } else { // intent === 'signup'
      if (user) {
        // Case S1 (Generic): Social ID already exists - Login (already signed up this way)
        console.log(`[ProcessSocialLogin - ${provider} - Signup] User found by ${provider}Id. Already registered. Logging in.`);
        isNewUserResponse = false;
      } else {
        // Social ID not found. Process signup.
        console.log(`[ProcessSocialLogin - ${provider} - Signup] User not found by ${provider}Id. Processing signup.`);

        // Specific handling for Kakao signup if email is not provided
        if (provider === 'kakao' && !email) {
          console.log(`[ProcessSocialLogin - kakao - Signup] Kakao user has no email. Returning ACCOUNT_NOT_FOUND_NO_EMAIL with temp profile.`);
          return res.status(400).json({ // Or 200 with special instruction, depends on client handling preference
            success: false, // Or true if client expects to proceed to email entry page from a "successful" preliminary step
            message: '카카오 계정에 연결된 이메일 정보가 없습니다. 서비스 가입을 위해 이메일 정보를 입력해주세요.',
            errorCode: 'ACCOUNT_NOT_FOUND_NO_EMAIL',
            tempKakaoProfile: { // Send back the profile for client to use in SocialEmailRequestPage
                kakaoId: socialId,
                nickname: nameFromSocial,
                profileImage: profileImage
            }
          });
        }

        // For all providers (including Kakao if it has email), check for email conflict before creating new user
        if (email) {
            const existingUserWithEmail = await User.findOne({ email: email });
            console.log(`[ProcessSocialLogin - ${provider} - Signup] User found by email (${email}) for conflict check:`, existingUserWithEmail ? existingUserWithEmail.toObject() : null);
            if (existingUserWithEmail) {
                // Case S3: Email already exists - Conflict
                console.warn(`[ProcessSocialLogin - ${provider} - Signup] Email ${email} already exists with provider ${existingUserWithEmail.provider}. Conflict.`);
                return res.status(409).json({ 
                    success: false, 
                    message: '이미 해당 이메일로 가입된 계정이 있습니다. 다른 이메일을 사용하거나 해당 이메일로 로그인해주세요.',
                    errorCode: 'EMAIL_ALREADY_EXISTS'
                });
            }
        }
        
        // Case S4/S5: New user - Create account
        console.log(`[ProcessSocialLogin - ${provider} - Signup] No conflict. Creating new user.`);
        user = await User.create({
          provider: provider,
          socialId: socialId,
          email: email, // Can be null for Kakao if policy allows direct creation, but we now send to email request page
          nickname: nameFromSocial || `User_${provider.substring(0,1)}${socialId.substring(0, 8)}`,
          profileImage: profileImage || undefined,
          isEmailVerified: email ? (isSocialEmailVerified === undefined ? true : isSocialEmailVerified) : false,
        });
        isNewUserResponse = true;
        console.log(`[ProcessSocialLogin - ${provider} - Signup] New user created:`, user.toObject());
      }
    }

    if (!user) {
        console.error(`[ProcessSocialLogin - ${provider}] User object is null before sending token response. This should not happen if logic is correct.`);
        return res.status(500).json({ success: false, message: `${provider} 로그인 처리 중 예상치 못한 오류가 발생했습니다.`, errorCode: 'USER_PROCESSING_ERROR' });
    }

    console.log(`[ProcessSocialLogin - ${provider}] Final isNewUserResponse: ${isNewUserResponse} for user ID: ${user._id}`);
    sendTokenResponse(user, isNewUserResponse ? 201 : 200, res, isNewUserResponse);

  } catch (error) {
    console.error(`[ProcessSocialLogin - ${provider}] Error caught:`, error);
    if (error.name === 'MongoServerError' && error.code === 11000) { 
        return res.status(409).json({ success: false, message: '사용자 생성 중 중복 오류가 발생했습니다. (이메일 또는 소셜ID)', errorCode: 'USER_CREATION_DUPLICATE' });
    }
    // Specific token errors should be caught in the calling functions (googleLogin, kakaoLogin)
    next(error); 
  }
}

async function completeKakaoSignup(profileData, res, next) {
  const { kakaoId, email, nickname, profileImage } = profileData;
  console.log(`[CompleteKakaoSignup] Attempting to complete signup for KakaoID: ${kakaoId} with email: ${email}`);

  if (!kakaoId || !email) {
    return res.status(400).json({ success: false, message: 'Kakao ID와 이메일은 필수입니다.', errorCode: 'MISSING_REQUIRED_FIELDS' });
  }

  try {
    // 1. Check if the provided email is already in use
    const existingUserWithEmail = await User.findOne({ email: email });
    if (existingUserWithEmail) {
      console.warn(`[CompleteKakaoSignup] Email ${email} already exists with provider ${existingUserWithEmail.provider}. Conflict.`);
      return res.status(409).json({ 
          success: false, 
          message: '이미 해당 이메일로 가입된 계정이 있습니다. 다른 이메일을 사용하거나 해당 이메일로 로그인해주세요.',
          errorCode: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // 2. Check if this Kakao ID was somehow already registered (should be unlikely if processSocialLogin handled it)
    const existingKakaoUser = await User.findOne({ provider: 'kakao', socialId: kakaoId });
    if (existingKakaoUser) {
        console.warn(`[CompleteKakaoSignup] Kakao ID ${kakaoId} already registered. Logging in instead.`);
        // This case should ideally not be hit if the flow is correct, but as a fallback, log them in.
        return sendTokenResponse(existingKakaoUser, 200, res, false);
    }

    // 3. Create the new user
    const user = await User.create({
      provider: 'kakao',
      socialId: kakaoId,
      email: email,
      nickname: nickname || `User_K${kakaoId.substring(0, 8)}`,
      profileImage: profileImage || undefined,
      isEmailVerified: true, // Email provided by user now, assume verified by virtue of them having access to it (or add verification step later)
    });
    console.log(`[CompleteKakaoSignup] New user created successfully for KakaoID: ${kakaoId}, Email: ${email}`);

    // 4. Send token response (as a new user signup)
    sendTokenResponse(user, 201, res, true); // true for isNewUserResponse

  } catch (error) {
    console.error(`[CompleteKakaoSignup] Error caught:`, error);
    if (error.name === 'MongoServerError' && error.code === 11000) { 
        return res.status(409).json({ success: false, message: '사용자 생성 중 중복 오류가 발생했습니다. (이메일 또는 소셜ID)', errorCode: 'USER_CREATION_DUPLICATE' });
    }
    next(error); 
  }
}

module.exports = { getSocialUserInfo, processSocialLogin, completeKakaoSignup }; 