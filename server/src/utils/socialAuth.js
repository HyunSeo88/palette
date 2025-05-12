const { OAuth2Client } = require('google-auth-library');
const axios = require('axios'); // Kakao 연동을 위해 추가

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY; // Kakao REST API 키
// const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET; // 필요시 사용

/**
 * Verifies a Google ID token and returns user information.
 * @param {string} idToken - The Google ID token from the client.
 * @returns {Promise<object>} An object containing socialId, email, name, profileImage, and isEmailVerified.
 * @throws {Error} If token verification fails or GOOGLE_CLIENT_ID is not set.
 */
async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID (GOOGLE_CLIENT_ID) is not configured in environment variables.');
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (!payload) {
        throw new Error('Invalid Google ID token: payload is missing.');
    }

    const socialId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const profileImage = payload['picture'];
    const isEmailVerified = payload['email_verified'];

    if (!socialId) {
        throw new Error('Invalid Google ID token: socialId (sub) is missing from payload.');
    }

    return {
      socialId,
      email,
      name,
      profileImage,
      isEmailVerified,
    };
  } catch (error) {
    console.error('Error verifying Google ID token:', error.message);
    const verificationError = new Error(`Google token verification failed: ${error.message}`);
    verificationError.name = 'SocialTokenVerificationError';
    throw verificationError;
  }
}

/**
 * Verifies a Kakao access token and returns user information.
 * @param {string} accessToken - The Kakao access token from the client.
 * @returns {Promise<object>} An object containing socialId, email, name, profileImage, and isEmailVerified.
 * @throws {Error} If token verification fails or KAKAO_REST_API_KEY is not set.
 */
async function verifyKakaoToken(accessToken) {
  if (!KAKAO_REST_API_KEY) {
    // Kakao는 REST API Key만 필수, Client Secret은 선택적이므로 일단 REST API Key만 체크
    throw new Error('Kakao REST API Key (KAKAO_REST_API_KEY) is not configured in environment variables.');
  }
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });

    const kakaoAccount = response.data.kakao_account;
    const properties = response.data.properties; // nickname, profile_image 등은 properties에도 있음

    if (!response.data.id) {
      throw new Error('Invalid Kakao token: socialId (id) is missing from payload.');
    }

    const socialId = response.data.id.toString(); // Kakao ID는 숫자일 수 있으므로 문자열로 변환
    const email = kakaoAccount?.email; // 이메일은 선택 동의 항목일 수 있음
    // Kakao는 닉네임과 프로필 이미지를 properties 또는 kakao_account.profile에서 가져올 수 있음
    const name = properties?.nickname || kakaoAccount?.profile?.nickname;
    const profileImage = properties?.profile_image || kakaoAccount?.profile?.profile_image_url;
    const isEmailVerified = kakaoAccount?.is_email_verified; // 이메일 인증 여부 (선택 동의)

    return {
      socialId,
      email, // 없을 수 있음
      name,  // 없을 수 있음
      profileImage, // 없을 수 있음
      isEmailVerified, // 없을 수 있음
    };

  } catch (error) {
    console.error('Error verifying Kakao access token:', error.response ? error.response.data : error.message);
    const verificationError = new Error(`Kakao token verification failed: ${error.response?.data?.msg || error.message}`);
    verificationError.name = 'SocialTokenVerificationError';
    if (error.response?.status) {
        verificationError.statusCode = error.response.status; // HTTP 상태 코드 추가
    }
    throw verificationError;
  }
}

/**
 * Fetches Google user information using an access token.
 * @param {string} accessToken - The Google access token from the client.
 * @returns {Promise<object>} An object containing id (socialId), email, name, profileImage, and isEmailVerified.
 * @throws {Error} If the request to Google fails or the token is invalid.
 */
async function getGoogleUserInfoFromAccessToken(accessToken) {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const googleData = response.data;

    if (!googleData.sub) {
      throw new Error('Invalid Google access token: socialId (sub) is missing from userinfo.');
    }

    return {
      id: googleData.sub, // This is the unique Google User ID
      email: googleData.email,
      name: googleData.name,
      profileImage: googleData.picture,
      isEmailVerified: googleData.email_verified,
    };
  } catch (error) {
    console.error('Error fetching Google user info from access token:', error.response ? error.response.data : error.message);
    const fetchError = new Error(`Failed to fetch Google user info: ${error.response?.data?.error_description || error.response?.data?.error || error.message}`);
    fetchError.name = 'GoogleUserInfoError';
    if (error.response?.status) {
        fetchError.statusCode = error.response.status;
    }
    throw fetchError;
  }
}

module.exports = {
  verifyGoogleToken,
  verifyKakaoToken,
  getGoogleUserInfoFromAccessToken,
}; 